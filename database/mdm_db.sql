-- MySQL dump 10.13  Distrib 8.4.7, for Win64 (x86_64)
--
-- Host: localhost    Database: mdm_db
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `mdm_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `mdm_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `mdm_db`;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKmi8vkhus4xbdbqcac2jm4spvd` (`username`),
  KEY `idx_admin_username_password` (`username`,`password`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (2,'2026-07-15 10:17:26.000000','admin123','ADMIN','admin');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app`
--

DROP TABLE IF EXISTS `app`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `package_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apk_url` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apk_content_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apk_file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apk_original_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apk_size` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_app_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app`
--

LOCK TABLES `app` WRITE;
/*!40000 ALTER TABLE `app` DISABLE KEYS */;
INSERT INTO `app` VALUES (15,'2026-07-21 09:54:14.950302','Test','Com.test','ACTIVE','REQUIRED','4.3','http://localhost:8080/api/apps/15/apk','application/vnd.android.package-archive','d37e1cc2-8440-44c2-a01f-a19c9d354da7_test-upload.apk','test-upload.apk',18),(17,'2026-07-21 10:18:56.482153','VLC','com.vlc ','ACTIVE','REQUIRED','3.6.5','http://localhost:8080/api/apps/17/apk','application/vnd.android.package-archive','c29d38b1-2928-42c9-b117-cb25126835e8_org.videolan.vlc_13060505.apk','org.videolan.vlc_13060505.apk',47194511),(19,'2026-07-21 10:20:22.238705','K-9 Mail','com.mail K-9','ACTIVE','REQUIRED',' 19.2','http://localhost:8080/api/apps/19/apk','application/vnd.android.package-archive','3c8683e0-d78a-4d53-a4e4-5e5fc1b10ce6_com.fsck.k9_39038.apk','com.fsck.k9_39038.apk',10584192),(20,'2026-07-21 10:21:47.454120','NewPipe','Com.newpipe','ACTIVE','OPTIONAL','0.28.4','http://localhost:8080/api/apps/20/apk','application/vnd.android.package-archive','28f329ea-3c10-463f-9508-be24e0235ee0_org.schabi.newpipe_1009.apk','org.schabi.newpipe_1009.apk',10811834),(21,'2026-07-21 10:24:00.225093','F-Droid','com.droid','ACTIVE','REQUIRED','1.23','http://localhost:8080/api/apps/21/apk','application/vnd.android.package-archive','9bd66ca2-1efc-44cd-9ce2-a4a204ec70a4_org.fdroid.fdroid_1023051.apk','org.fdroid.fdroid_1023051.apk',12426276);
/*!40000 ALTER TABLE `app` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device`
--

DROP TABLE IF EXISTS `device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_identifier` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enrolled_at` datetime(6) DEFAULT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `os` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_device_identifier` (`device_identifier`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device`
--

LOCK TABLES `device` WRITE;
/*!40000 ALTER TABLE `device` DISABLE KEYS */;
INSERT INTO `device` VALUES (1,'Samsung','DEV-001','2026-07-14 12:22:48.752432','A12','Android','ACTIVE'),(2,'Samsung ','DEV-002','2026-07-14 15:55:30.674145','A15','Android','ACTIVE'),(10,'Samsung','Dev-003','2026-07-15 09:28:18.202139','A14','Android','ACTIVE'),(11,'Apple','Dev-004','2026-07-15 11:28:24.470394','12 pro max','ios','ACTIVE'),(12,'Samsung','DEV-001','2026-07-16 09:56:58.000000','Galaxy A12','Android','ACTIVE'),(13,'Apple','DEV-002','2026-07-16 09:56:58.000000','iPhone 11','iOS','ACTIVE'),(14,'Xiaomi','DEV-003','2026-07-16 09:56:58.000000','Redmi Note 10','Android','ACTIVE'),(15,'HP','DEV-004','2026-07-16 09:56:58.000000','Tablet Pro','Windows','ACTIVE'),(16,'iphone','Dev-009','2026-07-16 09:07:13.242934','17 pro max','ios','ACTIVE');
/*!40000 ALTER TABLE `device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_profile`
--

DROP TABLE IF EXISTS `device_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_profile` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `assigned_at` datetime(6) DEFAULT NULL,
  `device_id` bigint DEFAULT NULL,
  `profile_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcrimmoe72p4ye83tmji6mpwg7` (`device_id`),
  KEY `FKnjyt19rdv2e75ohp7bjjjlki0` (`profile_id`),
  CONSTRAINT `FKcrimmoe72p4ye83tmji6mpwg7` FOREIGN KEY (`device_id`) REFERENCES `device` (`id`),
  CONSTRAINT `FKnjyt19rdv2e75ohp7bjjjlki0` FOREIGN KEY (`profile_id`) REFERENCES `mdm_profile` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_profile`
--

LOCK TABLES `device_profile` WRITE;
/*!40000 ALTER TABLE `device_profile` DISABLE KEYS */;
INSERT INTO `device_profile` VALUES (4,_binary '','2026-07-15 10:48:50.741393',1,2),(5,_binary '','2026-07-16 07:58:03.450767',11,4);
/*!40000 ALTER TABLE `device_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mdm_alerts`
--

DROP TABLE IF EXISTS `mdm_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mdm_alerts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `message` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `severity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_id` bigint DEFAULT NULL,
  `admin_response` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resolved_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKib5na0cu9bgppsndxwyr4m15i` (`device_id`),
  CONSTRAINT `FKib5na0cu9bgppsndxwyr4m15i` FOREIGN KEY (`device_id`) REFERENCES `device` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mdm_alerts`
--

LOCK TABLES `mdm_alerts` WRITE;
/*!40000 ALTER TABLE `mdm_alerts` DISABLE KEYS */;
INSERT INTO `mdm_alerts` VALUES (1,'2026-07-15 10:34:55.418740','App missing','MEDIUM','IN_PROGRESS','APP_MISSING',10,'Problème traité par l’administrateur.','2026-07-16 10:05:24.576532'),(2,'2026-07-16 07:59:34.682291','L\'app est volé ','HIGH','IN_PROGRESS','APP_MISSING',15,NULL,NULL);
/*!40000 ALTER TABLE `mdm_alerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mdm_commands`
--

DROP TABLE IF EXISTS `mdm_commands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mdm_commands` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `executed_at` datetime(6) DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdkevcwrl9i091fbl0h9og3i9x` (`device_id`),
  CONSTRAINT `FKdkevcwrl9i091fbl0h9og3i9x` FOREIGN KEY (`device_id`) REFERENCES `device` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mdm_commands`
--

LOCK TABLES `mdm_commands` WRITE;
/*!40000 ALTER TABLE `mdm_commands` DISABLE KEYS */;
INSERT INTO `mdm_commands` VALUES (1,'2026-07-15 10:07:35.510939','Travaille ','2026-07-15 10:08:07.209643','EXECUTED','RESTART_DEVICE',1),(2,'2026-07-15 11:30:17.219505','App perdu',NULL,'FAILED','REMOVE_APP',11),(3,'2026-07-16 07:58:41.633530','Demande de l\'installation d\'un app ','2026-07-16 07:58:41.633530','EXECUTED','INSTALL_APP',14);
/*!40000 ALTER TABLE `mdm_commands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mdm_profile`
--

DROP TABLE IF EXISTS `mdm_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mdm_profile` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_profile_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mdm_profile`
--

LOCK TABLES `mdm_profile` WRITE;
/*!40000 ALTER TABLE `mdm_profile` DISABLE KEYS */;
INSERT INTO `mdm_profile` VALUES (1,'2026-07-14 12:28:11.926833','Profil pour les appareils des etudiants','Profil Etudiant','INACTIVE'),(2,'2026-07-16 09:56:58.000000','Profil destiné aux étudiants avec accès limité aux applications pédagogiques','Profil Étudiant','ACTIVE'),(4,'2026-07-16 09:56:58.000000','Profil temporaire avec permissions limitées','Profil Invité','ACTIVE'),(7,'2026-07-16 09:19:33.181936','Azize lmoudiraaa','Profil Azize ','ACTIVE');
/*!40000 ALTER TABLE `mdm_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_app`
--

DROP TABLE IF EXISTS `profile_app`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_app` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `added_at` datetime(6) DEFAULT NULL,
  `required` bit(1) NOT NULL,
  `app_id` bigint DEFAULT NULL,
  `profile_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5wg5a0fd56127mu2rvdv4v4pj` (`app_id`),
  KEY `FK772dvfcv1772agme0im28qokl` (`profile_id`),
  CONSTRAINT `FK5wg5a0fd56127mu2rvdv4v4pj` FOREIGN KEY (`app_id`) REFERENCES `app` (`id`),
  CONSTRAINT `FK772dvfcv1772agme0im28qokl` FOREIGN KEY (`profile_id`) REFERENCES `mdm_profile` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_app`
--

LOCK TABLES `profile_app` WRITE;
/*!40000 ALTER TABLE `profile_app` DISABLE KEYS */;
INSERT INTO `profile_app` VALUES (20,'2026-07-21 09:57:41.783540',_binary '',15,1),(21,'2026-07-21 10:27:24.057187',_binary '',21,2),(22,'2026-07-21 10:27:24.065472',_binary '',20,2),(23,'2026-07-21 10:27:40.331172',_binary '',19,4),(24,'2026-07-21 10:27:40.347520',_binary '',15,4),(25,'2026-07-21 10:27:40.347520',_binary '',17,4);
/*!40000 ALTER TABLE `profile_app` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-21 13:19:46
