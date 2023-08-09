package com.ssafy.backend.file;

import com.ssafy.backend.entity.UploadFile;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
public class FileStore {

//    @Value("${file.dir")
    private String fileDir = "/var/www/profiles"; //"C:\\Users\\SSAFY\\Documents\\profile";





private String makeFolder(){

        String str = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String folderPath = str.replace("/", File.separator);

        File uploadPathFolder = new File(fileDir, folderPath);

        if(uploadPathFolder.exists() == false){
            uploadPathFolder.mkdirs();
        }
        return folderPath;
        }





public String getFullPath(String filename){
        return fileDir + filename;
    }

    public UploadFile storeFile(MultipartFile multipartFile) throws IOException {
        if(multipartFile ==null){
            return null;
        }

        String folderPath = makeFolder();
        String uuid = UUID.randomUUID().toString();
        String saveName = fileDir + File.separator + folderPath +File.separator + uuid;

        try{
            multipartFile.transferTo(new File(saveName));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new UploadFile(multipartFile.getOriginalFilename(),saveName, folderPath +File.separator + uuid);

    }

    private String createStoreFileName(String originalFileName) {
        String uuid = UUID.randomUUID().toString();
        String ext = extractExt(originalFileName);
        return uuid + "." + ext;
    }

    private String extractExt(String originalFileName){
        int pos = originalFileName.lastIndexOf(".");
        return originalFileName.substring(pos+1);    }
}
