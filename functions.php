<?

/**
 * Если какая-то из этих переменных или функций понадобится на движке,
 * ее нужно будет перенести в libs/functions/project.php
 */

define('SITE_DOMAIN',			$_SERVER['SERVER_NAME']);
define('WWW_DIR', str_replace('\\', '/', realpath(dirname(__FILE__)) . '/') );
define('WWW_PATH', str_replace(str_replace('\\', '/', realpath($_SERVER['DOCUMENT_ROOT'])), '', WWW_DIR));

$serverPort	= intval($_SERVER['SERVER_PORT']);
$isSecure	= ( ! empty($_SERVER['HTTPS']) && strToLower($_SERVER['HTTPS']) !== 'off') || $serverPort === 443;
$port		= ($serverPort !== 80 && $serverPort !== 443)? (':'.$_SERVER['SERVER_PORT']) : '';
define('SITE_URL',				($isSecure ? 'https':'http' ) .'://' . SITE_DOMAIN . $port . WWW_PATH);	// Полный URL к корню сайта

define('WORK_DIR', ROOT_DIR . 'templates/');
define('MODULES_DIR', WORK_DIR . 'pages/');
define('COMPONENTS_DIR', WORK_DIR . 'components/');
define('AJAX_RESPONSES_DIR', WORK_DIR . 'ajax/');

define('CSS_BUILD_PATH', 'templates/build/css/');
define('JS_BUILD_PATH', 'templates/build/js/');
define('IMG_BUILD_PATH', 'templates/build/images/');
define('IMG_DEV_PATH', 'templates/images/');
define('SVG_SPRITE_PATH', 'templates/src/images/symbols.svg');

define('SVG_SPRITE_VERSION', file_exists(SVG_SPRITE_PATH) ? filemtime(SVG_SPRITE_PATH) : 0);

function tpl($fileName, $localVars = []) {
	if ($localVars) {
		extract($localVars);
	}
	include WORK_DIR . $fileName;
}

function component($component, $data = []) {
	if ($data) {
		extract($data);
	}
	include COMPONENTS_DIR . $component . '.php';
}

function isAjax(){
	return (isset($_SERVER['HTTP_X_REQUESTED_WITH'])
			&& !empty($_SERVER['HTTP_X_REQUESTED_WITH'])
			&& strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') ? true: false;
}

function parseRequest() {
	$request = isset($_GET['REQUEST_URI']) ? $_GET['REQUEST_URI'] : '';
	$request = explode('/', $request);
	return $request;
}

function getModule($module) {
	ob_start();
	include MODULES_DIR . $module . '.php';
	$CONTENT = ob_get_contents();
	ob_end_clean();
	return $CONTENT;
}

function tplAjaxResponse($response) {
	require AJAX_RESPONSES_DIR . $response . '.php';
	exit();
}

function tplAjaxPage($content) {
	$arr = array(
		'title' => PAGE_TITLE,
		'body' => $content,
		'sectionId' => PAGE_SECTION_ID,
		'jsview' => PAGE_JS_VIEW
	);
	echo json_encode($arr);
	exit();
}

function tplPage($CONTENT) {
	//print_r(WORK_DIR . "BODY.tpl.php");
	include WORK_DIR . "BODY.tpl.php";
}

function urlV($path, $v = 0)
{
	if (!$v) {
		$v = filemtime($path);
	}
	return $path . "?v=" . $v;
}