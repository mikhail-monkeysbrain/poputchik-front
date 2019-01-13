<?define('ROOT_DIR', realpath(__DIR__) . '/');
include ROOT_DIR . "functions.php";

$request = parseRequest();
$module = $request[0];

if ($module === '') {
	$module = 'index';
}

if ($module == 'ajax') {
	tplAjaxResponse($request);
} else {
	$content = getModule($module);
	if (isAjax()) {
		tplAjaxPage($content);
	} else {
		tplPage($content);
	}
}
?>