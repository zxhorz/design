package com.zxh.dormMG.Service;

import com.zxh.dormMG.Repository.ApplicationRepository;
import com.zxh.dormMG.controllers.UserController;
import com.zxh.dormMG.domain.Application;
import com.zxh.dormMG.domain.Notice;
import com.zxh.dormMG.domain.User;
import com.zxh.dormMG.dto.ResultDto;
import com.zxh.dormMG.dto.UserDto;
import com.zxh.dormMG.enums.Operation;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ApplicationService {
    private static final Logger logger = Logger.getLogger(ApplicationService.class);
    private static final String ADMIN = "admin";
    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserController userController;

    public boolean applicationAdd(Application application) {
        try {
            applicationRepository.save(application);
            return true;
        } catch (Exception e) {
            logger.error(e.getMessage());
            return false;
        }
    }

    public List<Application> applicationList() {
        ResultDto<UserDto> user = userController.getUser();
        String name = user.getData().getUserName();
        List<Application> list = new ArrayList<>();
        Iterable<Application> applications;
        if(Objects.equals(user.getData().getRole(), ADMIN)){
            applications = applicationRepository.findAll();
        }else {
            applications = applicationRepository.findApplicationByName(name);
        }

        for (Application application : applications) {
            list.add(application);
        }
        return list;
    }

    public Application applicationGet(String id) {
        return applicationRepository.findApplicationById(id);
    }

    public boolean applicationDelete(String id) {
        try {
            Application application = new Application(id);
            applicationRepository.delete(application);
            logger.info("application deleted successfully");
            return true;
        } catch (Exception e) {
            logger.error(e.getMessage());
            return false;
        }
    }

    public boolean operate(String id, String string) {
        Application application = applicationRepository.findApplicationById(id);
        if (application == null)
            return false;
        Operation operation = findOperation(string);
        switch (operation) {
            case FINISH:
                application.setStatus("isFinished");
                break;
            case HANDLE:
                application.setStatus("isHandling");
                break;
            case REJECT:
                application.setStatus("isRejected");
                break;
            default:
                return false;
        }
        applicationRepository.save(application);
        return true;
    }

    public Operation findOperation(String string) {
        for (Operation e : Operation.values()) {
            if (Objects.equals(e.getOperation(), string)) {
                return e;
            }
        }
        return null;
    }
}