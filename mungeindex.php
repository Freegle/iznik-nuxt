<?php

$txt = file_get_contents(".nuxt/index.js");
$lines = explode("\n", $txt);
$op = '';
       
foreach ($lines as $line) { 
  if (strpos($line, 'import nuxt_plugin_bootstrapvue') === FALSE)  {
    if (strpos($line, 'import nuxt_plugin_polyfills') !== FALSE)  {
      $op .= $line . "\n" . $bv . "\n";
    } else { 
      $op .= $line . "\n";
    }
  } else {
    $bv = $line;
  }
}

echo $op;
