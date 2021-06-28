package com.trello.ojet.controller;

import com.google.gson.Gson;
import com.trello.ojet.dto.UserDto;
import com.trello.ojet.service.RestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/")
public class HomeController {

    @Autowired
    RestService restService;

    @PostMapping(value = "/create")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> create (UserDto userDto){
        restService.create(userDto);
        return ResponseEntity.ok("asdas");
    }

    @RequestMapping(value = "/datatable", method = RequestMethod.GET)
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> kiralikTable() {
        List<UserDto> userDtos = new ArrayList<>();
        userDtos = restService.findAll();
        String jsonDataForm = new Gson().toJson(userDtos);
        System.out.println(jsonDataForm);
        return ResponseEntity.ok(jsonDataForm);
    }

    @PostMapping(value = "/update")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> update(UserDto userDto){
        restService.update(userDto);
        return ResponseEntity.ok("");
    }

    @PostMapping(value = "/delete")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> delete(int id){
        restService.delete(id);
        return ResponseEntity.ok("");
    }

}
