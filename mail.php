<?php
/**
 * DOZARI TEAM - Backend Mail Handler
 * Обработчик формы заявки с использованием PHPMailer (SMTP)
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// 1. ИСПРАВЛЕНИЕ: Жестко подключаем файлы библиотеки (они должны лежать в папке phpmailer рядом со скриптом)
require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

header('Content-Type: application/json; charset=utf-8');

// Защита от прямых заходов по ссылке
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
    exit;
}

// Сбор и базовая очистка данных
$name       = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$phone      = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
$age        = isset($_POST['age']) ? intval($_POST['age']) : 0;
$experience = isset($_POST['experience']) ? strip_tags(trim($_POST['experience'])) : 'Не указан';

if (empty($name) || empty($phone) || $age <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Заполните все обязательные поля.']);
    exit;
}

// Очистка телефона от лишних символов (оставляем только цифры и плюс для ссылки tel:)
$cleanPhone = preg_replace('/[^\d+]/', '', $phone);

$mail = new PHPMailer(true);

try {
    // НАСТРОЙКИ SMTP 
    $mail->isSMTP();
    $mail->Host       = 'smtp.mail.ru';
    $mail->SMTPAuth   = true;
    
    // ВАЖНО: Сюда вписываем тот самый ТЕХНИЧЕСКИЙ ящик, который будет рассылать письма
    $mail->Username   = 'robot-dozari@mail.ru';          
    $mail->Password   = 'СЮДА_ВСТАВИТЬ_16_ЗНАЧНЫЙ_ПАРОЛЬ_ПРИЛОЖЕНИЯ';
    
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';

    // От кого (совпадает с Username) и Кому (почта Сергея Андреевича)
    $mail->setFrom('robot-dozari@mail.ru', 'Сайт DOZARI TEAM');
    $mail->addAddress('director@mail.ru', 'Сергей Андреевич'); 

    // Контент письма
    $mail->isHTML(true);
    $mail->Subject = '🏁 Новая заявка на вступление в команду DOZARI';

    $mail->Body = '
    <div style="font-family: Arial, sans-serif; background-color: #121316; color: #ffffff; padding: 30px; border-top: 4px solid #14a800;">
        <h2 style="color: #14a800; text-transform: uppercase; font-style: italic;">DOZARI TEAM — Новая заявка</h2>
        <p style="color: #a0a5b0;">Поступила новая заявка с сайта от потенциального пилота:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background: #18191d;">
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <td style="padding: 12px; color: #a0a5b0; width: 150px;">Имя:</td>
                <td style="padding: 12px; font-weight: bold; color: #ffffff;">' . htmlspecialchars($name) . '</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <td style="padding: 12px; color: #a0a5b0;">Телефон:</td>
                <td style="padding: 12px; font-weight: bold;"><a href="tel:' . htmlspecialchars($cleanPhone) . '" style="color: #14a800; text-decoration: none;">' . htmlspecialchars($phone) . '</a></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <td style="padding: 12px; color: #a0a5b0;">Возраст:</td>
                <td style="padding: 12px; font-weight: bold; color: #ffffff;">' . $age . ' лет</td>
            </tr>
            <tr>
                <td style="padding: 12px; color: #a0a5b0; vertical-align: top;">Опыт/комментарий:</td>
                <td style="padding: 12px; color: #ffffff; line-height: 1.4;">' . nl2br(htmlspecialchars($experience)) . '</td>
            </tr>
        </table>
        <p style="margin-top: 30px; font-size: 12px; color: #666;">Это автоматическое уведомление с сайта dozari-team.ru</p>
    </div>
    ';

    $mail->AltBody = "Новая заявка:\nИмя: $name\nТелефон: $phone\nВозраст: $age\nОпыт: $experience";

    // 2. ИСПРАВЛЕНИЕ: Раскомментировали отправку!
    $mail->send();

    // Отдаем фронтенду честный статус успеха
    echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена']);

} catch (Exception $e) {
    // 3. ИСПРАВЛЕНИЕ: Если письмо не ушло, честно отдаем ошибку 500 и success = false
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка отправки на сервере: ' . $mail->ErrorInfo]);
}
?>