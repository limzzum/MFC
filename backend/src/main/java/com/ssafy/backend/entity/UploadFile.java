package com.ssafy.backend.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter @ToString
public class UploadFile {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long id;

    @Column(name = "upload_filename")
    private String uploadFileName;

    @Column(name = "store_filename")
    private String storeFileName;

    public UploadFile(String originalFileName, String storeFileName) {
        this.uploadFileName = originalFileName;
        this.storeFileName = storeFileName;
    }
}
