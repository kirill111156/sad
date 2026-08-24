<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, bool $ok, string $message): void
{
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Метод не поддерживается.');
}

$host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
$host = preg_replace('/:\d+$/', '', $host);
if (!in_array($host, ['montessori-zhulebino.ru', 'www.montessori-zhulebino.ru'], true)) {
    respond(403, false, 'Недопустимый адрес сайта.');
}

session_start();
$now = time();
if (isset($_SESSION['last_form_submission']) && $now - (int) $_SESSION['last_form_submission'] < 30) {
    respond(429, false, 'Повторите отправку через несколько секунд.');
}

function clean(string $value, int $maxLength): string
{
    $value = trim(str_replace(["\r", "\0"], '', $value));
    return function_exists('mb_substr')
        ? mb_substr($value, 0, $maxLength, 'UTF-8')
        : substr($value, 0, $maxLength);
}

$name = clean((string) ($_POST['name'] ?? ''), 100);
$phone = clean((string) ($_POST['phone'] ?? ''), 50);
$age = clean((string) ($_POST['age'] ?? 'Не указан'), 50);
$message = clean((string) ($_POST['message'] ?? '—'), 1500);
$website = trim((string) ($_POST['website'] ?? ''));
$page = clean((string) ($_POST['page'] ?? ''), 250);

if ($website !== '') {
    respond(200, true, 'Спасибо! Заявка отправлена.');
}

if ($name === '' || $phone === '') {
    respond(422, false, 'Укажите имя и телефон.');
}

if (!preg_match('/^[0-9+()\-\s]{6,30}$/u', $phone)) {
    respond(422, false, 'Проверьте номер телефона.');
}

$recipient = 'katerina.da2005@yandex.ru';
$subjectText = 'Новая заявка — Сад Мир Монтессори';
$subject = function_exists('mb_encode_mimeheader')
    ? mb_encode_mimeheader($subjectText, 'UTF-8', 'B', "\r\n")
    : '=?UTF-8?B?' . base64_encode($subjectText) . '?=';

$body = implode("\n", [
    'Новая заявка с сайта montessori-zhulebino.ru',
    '',
    'Имя родителя: ' . $name,
    'Телефон: ' . $phone,
    'Возраст ребёнка: ' . ($age !== '' ? $age : 'Не указан'),
    'Комментарий: ' . ($message !== '' ? $message : '—'),
    'Страница: ' . ($page !== '' ? $page : 'Не указана'),
    'Дата: ' . date('d.m.Y H:i:s'),
]);

$headers = implode("\r\n", [
    'From: Сад Мир Монтессори <noreply@montessori-zhulebino.ru>',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . PHP_VERSION,
]);

if (!mail($recipient, $subject, $body, $headers)) {
    respond(500, false, 'Не удалось отправить заявку. Позвоните нам по телефону.');
}

$_SESSION['last_form_submission'] = $now;
respond(200, true, 'Спасибо! Заявка отправлена. Мы свяжемся с вами.');
