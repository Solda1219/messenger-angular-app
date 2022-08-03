<?php
   function pkeencrypt($plainText, $privateKeyPath, $publicKeyPath, $encryptProg,$siteId, $passPhrase, $timeVal)
   {
        global $php_errormsg;
        $originalSetting = ini_set('track_errors', 1);
        $cipher = '';
        $errCode = 0;
        $privateKeyAbsPath = $privateKeyPath;
        $publicKeyAbsPath = $publicKeyPath;
        $oneLineInput = preg_replace("/\r|\n/", '', $plainText);
        // Put encryption command, settings (public/private key location), and data into an ASCII instruction file
        $cmd = "encrypt,$privateKeyAbsPath,$passPhrase,$publicKeyAbsPath,$siteId,$oneLineInput";
        $tempDir = '<system-default-temp>';
        $errorFile = realpath('../../_public/temp').'/error-'.$timeVal;
        $instructionFile = realpath('../../_public/temp').'/instruction-'.$timeVal;
        print($instructionFile);
        $hFile = fopen($instructionFile, "w");
        fwrite($hFile, $cmd);
        fclose($hFile);
        // Give the instruction file to encryptor
        $niceCmd = "";
        $rtn = exec("{$niceCmd} \"{$encryptProg}\" 2>$errorFile <$instructionFile", $response, $errCode);
        return $response;
   }