<!--<META HTTP-EQUIV='Refresh' CONTENT='1;' >-->

<?php
error_reporting(E_STRICT);
require 'jsmin.php';

/*====================================

=            JS minifier             =

====================================*/

$project = 'swipeCarousel_1.0.0';
$description = 'javascript assets';
$copyright = '2014 Wip Italia S.r.l.';
$authorurl = 'http://www.wipitalia.it/';
$note = 'this file is minimized and inport by script.html include';

$libs = array(
  'carousel'
  ,'custom'
  //'ext',
  //'jquery',
  //'mootools',
  //'yui',
  //'utf8-with-bom'
);

foreach ($libs as $lib) {

  $jsmin_php = JSMin::minify(file_get_contents("../js/".$lib.".js"));
  $jsmin_c = JSMin::minify(file_get_contents("../../js/".$lib.".min.js"));
  $date = date('m/d/Y h:i:s a', time());


  if ($jsmin_c === $jsmin_php) {
    ?>
      <link rel='shortcut icon' type='image/png' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsklEQVQ4jaWTMQ7CMAxF/1ZxCU7BedoTdOAG7sBJOAkjYuUGzF2owgLiMzQSLrGTRkTyEOU/59tOAGNxQEfBRAFjTBzQWdoU/kJm5MCxBKsYa24+Fp2U7GbPKWgdwVkl2DmaFhSEuHmv6vKc8BqZkNhbAd8WetPaHhsHvicXqhJ0HBK4R2Pogt3EHo3jIG2idaCACwUvCrZxHyzdb5IHBU9nbCe32X8/5UydVWOek1R85w93A4T6SFuzvQAAAABJRU5ErkJggg=='>
      <title>PASS - JS [<?php echo $lib ?>] minifier</title>
      <body>
      <p>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsklEQVQ4jaWTMQ7CMAxF/1ZxCU7BedoTdOAG7sBJOAkjYuUGzF2owgLiMzQSLrGTRkTyEOU/59tOAGNxQEfBRAFjTBzQWdoU/kJm5MCxBKsYa24+Fp2U7GbPKWgdwVkl2DmaFhSEuHmv6vKc8BqZkNhbAd8WetPaHhsHvicXqhJ0HBK4R2Pogt3EHo3jIG2idaCACwUvCrZxHyzdb5IHBU9nbCe32X8/5UydVWOek1R85w93A4T6SFuzvQAAAABJRU5ErkJggg=="> [PASS]: [<?php echo $lib ?>] minifier | <?php echo $date ?>
      </p>

      </body>

    <?php
  } else {




      $jsmin_php = "
/* =========================================================
 * [$lib.min.js]
 * Project:       $project
 * Description:   $description
 * Last change:   $date
 * Copyright:     $copyright
 * Author URI:    $authorurl
 * ========================================================= *
 * $note
 * ========================================================= */
   ".$jsmin_php;

      echo "
      <link rel='shortcut icon' type='image/png' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtklEQVQ4jcWRTQrCMBCFv2P4h+DPRtK0CF5AENy79YzFZlqvo7aKQi9RNwpNWkvtQh/MZvK+eckE/qEgYdsZ1kKmhcI7MOsCp1oo3uUZdq1hT7iUYS2ktsGwakg+O3BmGyL06yAv9/2QkRZOFmy42nDM3pmeAwQxQ6dfaOFWvV7ExjWqmHElWSh8YVL7RnWkV5NmV8K0ccuLkP4nuPWfLw0DZ2F3ZZi3gmuGPL4Cy1KGdWf453oC0FyEF/4/YeUAAAAASUVORK5CYII='>
      <title>NEW - JS minifier</title>
      <body>
        <p><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtklEQVQ4jcWRTQrCMBCFv2P4h+DPRtK0CF5AENy79YzFZlqvo7aKQi9RNwpNWkvtQh/MZvK+eckE/qEgYdsZ1kKmhcI7MOsCp1oo3uUZdq1hT7iUYS2ktsGwakg+O3BmGyL06yAv9/2QkRZOFmy42nDM3pmeAwQxQ6dfaOFWvV7ExjWqmHElWSh8YVL7RnWkV5NmV8K0ccuLkP4nuPWfLw0DZ2F3ZZi3gmuGPL4Cy1KGdWf453oC0FyEF/4/YeUAAAAASUVORK5CYII='> [NEW]: JS [".$lib."] minifier | AGGIORNATO: $date;
      </body>";

      file_put_contents("../../js/$lib.min.js",$jsmin_php);
  }
}

?>
