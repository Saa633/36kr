<?php
  header('content-type:text/html;charset=utf-8');

	$url = "http://36kr.com/api/search-column/".$_GET['types']."?per_page=".$_GET['nums']."&page=".$_GET['page'];

    $content = file_get_contents($url);
	
	echo $content;

?>