package com.zxh.dormMG.controllers;


import com.zxh.dormMG.utils.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.InetAddress;
import java.net.UnknownHostException;


@Controller
@RequestMapping("/office")
@ConfigurationProperties(prefix="myProps") //接收application.yml中的myProps下面的属性
public class OfficeController {


    @Value("${fileServer.domain}")
    String domain;

    @Value("${files.docservice.url.api}")
    String doc_api;

    @RequestMapping
    public String office(ModelMap map, String url, String filename) throws UnknownHostException {
        String userAddress = InetAddress.getLocalHost().getHostAddress();
        map.put("key", GenerateRevisionId(userAddress + "/" + filename));

        map.put("url", domain + url);

        map.put("filename", filename);

        map.put("fileType", FileUtils.getExtension(filename).replace(".", ""));

        map.put("doc_api", doc_api);

        map.put("documentType", FileUtils.GetFileType(filename).toString().toLowerCase());

        return "office";
    }

    private static String GenerateRevisionId(String expectedKey) {
        if (expectedKey.length() > 20)
            expectedKey = Integer.toString(expectedKey.hashCode());

        String key = expectedKey.replace("[^0-9-.a-zA-Z_=]", "_");

        return key.substring(0, Math.min(key.length(), 20));
    }
}
