<?php

    header('content-type:text/html;charset=utf-8');

	$url = "http://36kr.com/api//search/entity-search?page=1&per_page=10&keyword=".$_GET['keyword']."&entity_type=post";

    $content = file_get_contents($url);
	
	echo $content;

?>