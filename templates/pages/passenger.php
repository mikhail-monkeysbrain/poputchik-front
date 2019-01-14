<?
/**/
/** ВНИМАНИЕ!
* Этот файл сгенерирован автоматически и не подлежит редактированию.
* Исходники лежат в папке templates/src/jade
*/
/**/
?><?
define('PAGE_TITLE','Личный кабинет | Пассажир');
define('PAGE_SECTION_ID','1');
define('PAGE_JS_VIEW','Profile');
?>
<div data-view="<?=PAGE_JS_VIEW?>" class="page page--profile">
  <div class="container">
    <section class="profile parallax">
      <div class="profile--container container">
        <div class="profile--heading">
          <h1> </h1>
          <h2>
             
            Михаил Александрович<br/>Столповских
          </h2>
        </div>
      </div>
      <div class="edit container edit__container">
        <div class="avatar--wrapper"><i class="fas fa-edit"></i><img src="/templates/build/images/content/avatar.jpg" alt="" class="avatar"/></div>
        <input type="file" class="avatar--download"/>
        <label>
          <h3>Ваш номер телефона: </h3>
          <input type="text" value="+79000000000" class="edit--input input__phone"/>
        </label>
        <label>
          <h3>Ваш E-mail: </h3>
          <input type="text" value="monkeysbrain@yandex.ru" class="edit--input"/>
        </label>
        <label>
          <h3>Ваш автомобиль: </h3>
          <input type="text" value="Lada Lagus" class="edit--input"/>
        </label>
        <label>
          <h3>Количество мест: </h3>
          <input type="text" value="7" class="edit--input"/>
        </label>
        <label class="edit--save--wrapper">
          <div class="routes--list--link btn btn__transparent edit--save">Сохранить</div>
        </label>
      </div><br/>
      <hr/><br/>
      <h2>Ваши поездки</h2><br/>
      <div class="profile--table">
        <div class="thead">
          <div class="row row__date">Дата</div>
          <div class="row row__time">Время</div>
          <div class="row">Маршрут</div>
        </div>
        <div class="col">
          <div class="row row__date">10.01.2019</div>
          <div class="row row__time">18 : 30</div>
          <div class="row">Тюмень - Нягань</div>
        </div>
        <div class="col">
          <div class="row row__date">10.01.2019</div>
          <div class="row row__time">18 : 30</div>
          <div class="row">Тюмень - Нягань</div>
        </div>
        <div class="col">
          <div class="row row__date">10.01.2019</div>
          <div class="row row__time">18 : 30</div>
          <div class="row">Тюмень - Нягань</div>
        </div>
        <div class="col">
          <div class="row row__date">10.01.2019</div>
          <div class="row row__time">18 : 30</div>
          <div class="row">Тюмень - Нягань</div>
        </div>
        <div class="col">
          <div class="row row__date">10.01.2019</div>
          <div class="row row__time">18 : 30</div>
          <div class="row">Тюмень - Нягань</div>
        </div>
      </div><br/>
      <hr/><br/>
      <div class="container pay--container">
        <h3>Ваш баланс - <span>1500</span>р.</h3>
        <div class="routes--list--link btn btn__transparent edit--save pay--btn">Оплатить</div>
      </div><br/><br/>
    </section>
  </div>
  <div class="trip__container about__benefits">
    <div class="routes--list--link btn btn__transparent edit--save trip--btn">
       
      Предложить поездку
    </div>
    <div class="edit container edit__container">
      <section id="calendar" class="calendar">
        <div class="calendar--container container">
          <select name="route" class="dropDown">
            <option value="Тюмень - Сургут">Тюмень - Сургут</option>
            <option value="Сургут -Тюмень">Сургут -Тюмень</option>
            <option value="Тюмень - Ноябрьск">Тюмень - Ноябрьск</option>
            <option value="Ноябрьск - Тюмень">Ноябрьск - Тюмень</option>
            <option value="Нижневартовск - Ноябрьск">Нижневартовск - Ноябрьск</option>
            <option value="Ноябрьск - Нижневартовск">Ноябрьск - Нижневартовск</option>
            <option value="Ханты-Мансийск - Нягань">Ханты-Мансийск - Нягань</option>
            <option value="Нягань - Ханты-Мансийск">Нягань - Ханты-Мансийск</option>
            <option value="Нягань - Советский">Нягань - Советский</option>
            <option value="Советский - Нягань">Советский - Нягань</option>
            <option value="Нягань - Урай">Нягань - Урай</option>
            <option value="Урай - Нягань">Урай - Нягань</option>
            <option value="Нягань - Сургут">Нягань - Сургут</option>
            <option value="Сургут - Нягань">Сургут - Нягань</option>
          </select>
        </div>
        <div class="calendar--datepicker datepicker"></div>
        <label>
          <h3>Время отправления: </h3>
          <input type="text" value="" class="edit--input input__phone"/>
        </label>
        <label class="edit--save--wrapper">
          <div class="routes--list--link btn btn__transparent edit--save trip--save">Сохранить</div>
          <div class="routes--list--link btn btn__transparent edit--save trip--save">Отменить</div>
        </label>
      </section>
    </div>
  </div>
</div>