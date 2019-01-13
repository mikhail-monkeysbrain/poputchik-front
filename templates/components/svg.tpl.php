<svg class="<?=isset($baseCls)?$baseCls:'icon_svg--'.$id.'-fullsize'?> <?=isset($cls)?$cls:''?>" <?=isset($title)?'role="img"':'role="presentation"'?>>
	<? if (isset($title)):?>
		<title><?=$title?></title>
	<? endif;?>
	<use xlink:href="<?=SITE_URL?>templates/src/images/symbols.svg#<?=$id?>"></use>
</svg>