package com.trello.ojet.service;

import com.trello.ojet.dto.UserDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RestService {

    List<UserDto> userDtoList = new ArrayList<>();
    int tempInt=1;

    public List<UserDto> findAll(){
        return userDtoList;
    }

    public String create(UserDto userDto){
        userDto.setId(tempInt);
        userDtoList.add(userDto);
        tempInt = tempInt+1;
        return "";
    }

    public String update(UserDto userDto){
        for (UserDto userDto1 : userDtoList){
            if (userDto1.getId() == userDto.getId()){
                userDtoList.remove(userDto1);
                userDtoList.add(userDto);
            }
        }
        return "";
    }

    public void delete(int id){
        for (UserDto userDto : userDtoList){
            if (userDto.getId() == id)
                userDtoList.remove(userDto);
        }
    }

}
