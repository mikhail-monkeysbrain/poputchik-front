<?
/**/
/** ВНИМАНИЕ!
* Этот файл сгенерирован автоматически и не подлежит редактированию.
* Исходники лежат в папке templates/src/jade
*/
/**/
?><?
$sourceSuffix = '';
?><!DOCTYPE html>
<html>
  <head>
        <meta charset="utf-8">
        <base href="<?=SITE_URL?>">
        <title><?=PAGE_TITLE?></title>
        <meta content="Описание страницы" name="description">
        <meta content="Ключевые слова" name="keywords">
        <meta property="og:type" content="website">
        <link rel="image_src">
        <meta name="author">
        <meta content="telephone=no" name="format-detection">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="HandheldFriendly" content="true">
        <meta name="MobileOptimized" content="320">
        <meta content="IE=edge" http-equiv="X-UA-Compatible">
        <meta property="og:title" content="Заголовок для шеринга">
        <meta property="og:image" content="">
        <meta property="og:site_name" content="Название сайта для шеринга">
        <meta property="og:description" content="Описание для шеринга">
        <meta name="twitter:title" content="Заголовок для шеринга">
        <meta name="twitter:image:src" content="">
        <meta name="twitter:description" content="Описание для шеринга">
        <link rel="apple-touch-icon" sizes="57x57" href="/templates/build/favicon/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/templates/build/favicon/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/templates/build/favicon/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/templates/build/favicon/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/templates/build/favicon/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/templates/build/favicon/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/templates/build/favicon/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/templates/build/favicon/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/templates/build/favicon/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192" href="/templates/build/favicon/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/templates/build/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/templates/build/favicon/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/templates/build/favicon/favicon-16x16.png">
        <link rel="manifest" href="/templates/build/favicon//manifest.json">
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-TileImage" content="/templates/build/favicon//ms-icon-144x144.png">
        <meta name="theme-color" content="#ffffff">
        <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
        <link href="<?=urlV('templates/build/css/styles'.$sourceSuffix.'.css')?>" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
        <link href="https://fonts.googleapis.com/css?family=Black+Ops+One" rel="stylesheet">
  </head>
  <body>
    <script src="<?=urlV("templates/build/js/init".$sourceSuffix.".js")?>"></script>
        <header class="header">
          <div class="container header--container"><a href="/" class="header--login"> <i class="fas fa-sign-in-alt"></i>Войти</a>
            <div class="header--nav"><a href="/" class="header--nav--logo"><img src="/templates/build/images/content/logo.png" alt="logo" class="header--logo"></a>
              <nav class="header--nav--menu"><a href="/#map" class="header--nav--item">География</a><a href="/#routes" class="header--nav--item">Стоимость</a><a href="/#calendar" class="header--nav--item">Бронирование</a><a href="/#social" class="header--nav--item">Контакты</a></nav><a href="tel:+79000000000" class="header--phone"> <i class="fas fa-phone"></i>+79000000000</a>
            </div>
          </div>
        </header>
    <main class="grid"><?=$CONTENT?></main>
    <div class="loader js-loader">
      <div class="loader_box"></div>
    </div>
        <footer class="footer">
          <div class="footer--container container">
            <p>Попутчик24</p><a href="/" class="footer--login"> <i class="fas fa-sign-in-alt"></i>Войти</a>
            <div class="footer--nav">
              <nav class="footer--nav--menu"><a href="/#map" class="footer--nav--item">География</a><a href="/#routes" class="footer--nav--item">Стоимость</a><a href="/#calendar" class="footer--nav--item">Бронирование</a><a href="/#social" class="footer--nav--item">Контакты</a></nav><a href="tel:+79000000000" class="footer--phone"> <i class="fas fa-phone"></i>+79000000000</a>
            </div>
            <hr>
            <div class="footer--nav__middle">
              <nav class="footer--nav--menu"><a href="/#map" class="footer--nav--item">Тюмень - Ханты-Мансийск</a><a href="/#routes" class="footer--nav--item">Сургут - Нижневартовск</a><a href="/#calendar" class="footer--nav--item">Тюмень - Нягань</a><a href="/#social" class="footer--nav--item"> Тюмень - Сургут</a><a href="/#calendar" class="footer--nav--item">Сургут - Ноябрьск</a><a href="/#social" class="footer--nav--item"> Тюмень - Ноябрьск</a><a href="/#social" class="footer--nav--item"> Ханты-Мансийск - Сургут</a><a href="/#routes" class="footer--nav--item">Тюмень - Нижневартовск</a></nav>
            </div>
            <hr>
            <div class="footer__bottom"><a href="javascript:void(0)" class="footer--copy">&copy; monkeysbrain 2019</a><a class="btn btn__form btn__footer requireCustom custom--require">Оставить заявку</a></div>
          </div>
        </footer>
    <script src="<?=urlV("templates/build/js/libs".$sourceSuffix.".js")?>"></script>
    <script src="<?=urlV("templates/build/js/scripts".$sourceSuffix.".js")?>"></script>
  </body>
</html>