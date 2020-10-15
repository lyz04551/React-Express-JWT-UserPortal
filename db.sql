-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 15, 2020 at 03:44 PM
-- Server version: 10.4.10-MariaDB
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `react_crud`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(25) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `nickname` varchar(20) DEFAULT NULL,
  `amount_patients` int(4) NOT NULL,
  `amount_suitable_overflow` int(2) NOT NULL,
  `duration_time` datetime DEFAULT NULL,
  `color` int(4) NOT NULL,
  `deleted` int(1) NOT NULL DEFAULT 0,
  `fk_license` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `nickname`, `amount_patients`, `amount_suitable_overflow`, `duration_time`, `color`, `deleted`, `fk_license`) VALUES
(2, 'customer', 'customer', 23, 234, '2020-10-15 00:00:00', 1, 1, 'asdf'),
(3, 'sergiy', 'sergiy', 21, 234, '2020-10-06 00:00:00', 2, 1, 'asdf'),
(5, 'sdf', 'asdf', 21, 2, '2020-10-20 00:00:00', 3, 2, 'adsfadsf');

-- --------------------------------------------------------

--
-- Table structure for table `licenses`
--

DROP TABLE IF EXISTS `licenses`;
CREATE TABLE IF NOT EXISTS `licenses` (
  `id` int(25) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `fk_user` varchar(25) NOT NULL,
  `creation_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `expiration_date` datetime NOT NULL DEFAULT current_timestamp(),
  `fixed_time` float(4,2) NOT NULL DEFAULT 1.00,
  `all_markers` int(2) NOT NULL DEFAULT 1,
  `agenda_interval` int(2) NOT NULL DEFAULT 30,
  `agenda_start` time NOT NULL DEFAULT '00:00:01',
  `agenda_ending` time NOT NULL DEFAULT '23:59:59',
  `reminder_msg_event` varchar(400) DEFAULT ' ',
  `cat_color_active` int(1) NOT NULL DEFAULT 1,
  `locked` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `licenses`
--

INSERT INTO `licenses` (`id`, `name`, `fk_user`, `creation_time`, `expiration_date`, `fixed_time`, `all_markers`, `agenda_interval`, `agenda_start`, `agenda_ending`, `reminder_msg_event`, `cat_color_active`, `locked`) VALUES
(3, 'sergiy', 'sergiy', '2020-10-14 17:44:52', '2020-10-16 00:00:00', 5.00, 5, 5, '02:44:00', '03:44:00', 'adsf', 4, 1),
(4, 'sdf', 'sergiy', '2020-10-15 14:10:31', '2020-10-20 00:00:00', 6.00, 7, 4, '22:14:00', '22:14:00', 'adf', 4, 0),
(5, 'supplier', 'sergiy', '2020-10-15 15:04:51', '2020-10-26 00:00:00', 2.00, 3, 2, '23:06:00', '23:07:00', 'adfa', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
CREATE TABLE IF NOT EXISTS `log` (
  `id` int(25) NOT NULL,
  `user_id` int(25) NOT NULL,
  `action` int(5) NOT NULL,
  `action_type` int(5) NOT NULL,
  `action_timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `log`
--

INSERT INTO `log` (`id`, `user_id`, `action`, `action_type`, `action_timestamp`) VALUES
(0, 1, 1, 1, '2020-10-02 15:57:21');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
CREATE TABLE IF NOT EXISTS `patients` (
  `id` int(25) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `CPF` varchar(70) DEFAULT NULL,
  `gender` int(1) NOT NULL DEFAULT 0,
  `birthday` date NOT NULL,
  `email` varchar(80) DEFAULT NULL,
  `occupation` varchar(100) NOT NULL,
  `comments` text DEFAULT NULL,
  `picture` mediumblob DEFAULT NULL,
  `fk_license` varchar(25) NOT NULL,
  `deleted` int(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_1` (`fk_license`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `name`, `CPF`, `gender`, `birthday`, `email`, `occupation`, `comments`, `picture`, `fk_license`, `deleted`) VALUES
(5, 'customer', 'adfadf', 0, '2020-10-30', 'aaa@gmail.com', 'adfadf', NULL, '', 'adsfadsf', 1),
(6, 'sergiy', 'adfadf', 1, '2020-10-21', 'sdf@gmail.com', 'adfadf', NULL, '', 'adfadf', 0);

-- --------------------------------------------------------

--
-- Table structure for table `professionals`
--

DROP TABLE IF EXISTS `professionals`;
CREATE TABLE IF NOT EXISTS `professionals` (
  `id` int(25) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `gender` int(1) NOT NULL DEFAULT 0,
  `birthday` date NOT NULL,
  `email` varchar(80) NOT NULL,
  `comment` text DEFAULT NULL,
  `picture` varchar(200) DEFAULT NULL,
  `deleted` int(1) NOT NULL,
  `fk_license` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `professionals`
--

INSERT INTO `professionals` (`id`, `name`, `gender`, `birthday`, `email`, `comment`, `picture`, `deleted`, `fk_license`) VALUES
(43, 'sergiy', 1, '2020-10-13', 'admin@admin.com', 'adsfas', '', 1, 'asdf'),
(44, 'roman', 1, '2020-12-01', 'admin@adminsdf.com', 'adsfas', '', 0, 'asdf'),
(47, 'sergiy', 1, '2020-10-07', 'usfsf@admin.com', 'sdf', '', 0, 'asdf'),
(49, 'sdf', 1, '2020-10-02', 'tortuc@outlook.com', 'adf', 'C:\\fakepath\\SEO-2.jpg', 1, 'af'),
(50, 'sergiy', 0, '2020-10-14', 'customer@admin.com', 'asdf', '', 0, 'adf');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `nome`) VALUES
(4, 'ROLE_TESTER'),
(5, 'ROLE_TARGET_VIEW'),
(6, 'ROLE_TARGET_EDIT'),
(7, 'ROLE_TARGET_VIEW_DATA'),
(8, 'ROLE_PROF_VIEW'),
(9, 'ROLE_PROF_EDIT'),
(10, 'ROLE_PROF_VIEW_DATA'),
(11, 'ROLE_CAT_VIEW'),
(12, 'ROLE_CAT_EDIT'),
(13, 'ROLE_ROOM_VIEW'),
(14, 'ROLE_ROOM_EDIT'),
(15, 'ROLE_LOG_VIEW'),
(16, 'ROLE_EVENT_VIEW'),
(17, 'ROLE_EVENT_EDIT'),
(18, 'ROLE_EVENT_EDIT_RECEPTION'),
(19, 'ROLE_EVENT_EDIT_FINANCIAL'),
(20, 'ROLE_EVENT_EDIT_PROF'),
(21, 'ROLE_USER_VIEW'),
(22, 'ROLE_USER_EDIT'),
(23, 'ROLE_LIC_VIEW'),
(24, 'ROLE_LIC_EDIT'),
(25, 'ROLE_LIC_SYSADMIN'),
(26, 'ROLE_REPORT_VIEW'),
(27, 'ROLE_AGENDA_VIEW'),
(28, 'ROLE_LIC_OWN'),
(29, 'ROLE_AGENDA_EDIT'),
(30, 'ROLE_MIGRATION');

-- --------------------------------------------------------

--
-- Table structure for table `usergroup`
--

DROP TABLE IF EXISTS `usergroup`;
CREATE TABLE IF NOT EXISTS `usergroup` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `un_usergroup_nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `usergroup`
--

INSERT INTO `usergroup` (`id`, `nome`) VALUES
(1, 'admin'),
(46, 'customer'),
(49, 'supplier');

-- --------------------------------------------------------

--
-- Table structure for table `usergroup_role`
--

DROP TABLE IF EXISTS `usergroup_role`;
CREATE TABLE IF NOT EXISTS `usergroup_role` (
  `usergroup_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`usergroup_id`,`role_id`),
  KEY `fk_usergrouprole_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `usergroup_role`
--

INSERT INTO `usergroup_role` (`usergroup_id`, `role_id`) VALUES
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 25),
(1, 26),
(1, 27),
(1, 28),
(1, 29),
(46, 8),
(46, 9),
(46, 10),
(46, 30),
(49, 5),
(49, 6),
(49, 21);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(25) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(80) NOT NULL,
  `pass` varchar(200) NOT NULL,
  `initcode` varchar(250) DEFAULT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` int(1) NOT NULL DEFAULT 1,
  `master` int(2) DEFAULT 0,
  `active` tinyint(1) DEFAULT 0,
  `fk_professional` varchar(25) DEFAULT NULL,
  `fk_license` varchar(25) DEFAULT NULL,
  `deleted` int(1) DEFAULT 0,
  `creation_timestamp` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `pass`, `initcode`, `cpf`, `birthday`, `gender`, `master`, `active`, `fk_professional`, `fk_license`, `deleted`, `creation_timestamp`) VALUES
(1, 'admin', 'admin', 'admin@admin.com', '$2b$10$Gm1Ibk1G62qtkFnObtIafOSXCM5fKOub5tt7WUzH3SmrnvIIQgZZi', 'asdfasdf', 'adsf', '2020-12-01', 1, 0, 0, 'adf', 'adf', 0, '2020-10-14 18:21:07'),
(26, 'customer', 'customer', 'customer@admin.com', '$2b$10$TEMQRD0.BOM6mRFEXtMTQO4KMYOQObdF89fa40d8Q1d7iY469Ms86', 'safa', 'adf', '2020-10-14', 1, 1, 0, 'asdfasdf', 'asdf', 0, '2020-10-14 18:21:09'),
(28, 'supplier', 'supplier', 'supplier@admin.com', '$2b$10$wZ9iAcPTFaMMKVU4icLopeAcV5JClIRdQu1ldJEsVc0YmcS3lmxzq', 'adfadf', 'adfads', '2020-10-16', 0, 1, NULL, 'asdfasdf', 'asdfadf', 0, '2020-10-15 15:04:26');

-- --------------------------------------------------------

--
-- Table structure for table `users_role`
--

DROP TABLE IF EXISTS `users_role`;
CREATE TABLE IF NOT EXISTS `users_role` (
  `users_id` varchar(25) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`users_id`,`role_id`),
  KEY `fk_usersrole_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users_role`
--

INSERT INTO `users_role` (`users_id`, `role_id`) VALUES
('9', 1),
('9', 2);

-- --------------------------------------------------------

--
-- Table structure for table `users_usergroup`
--

DROP TABLE IF EXISTS `users_usergroup`;
CREATE TABLE IF NOT EXISTS `users_usergroup` (
  `users_id` int(10) NOT NULL,
  `usergroup_id` int(10) NOT NULL,
  PRIMARY KEY (`users_id`,`usergroup_id`),
  KEY `fk_usersusergroup_usergroup` (`usergroup_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users_usergroup`
--

INSERT INTO `users_usergroup` (`users_id`, `usergroup_id`) VALUES
(1, 1),
(26, 46),
(28, 49);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `usergroup_role`
--
ALTER TABLE `usergroup_role`
  ADD CONSTRAINT `fk_usergrouprole_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  ADD CONSTRAINT `fk_usergrouprole_usergroup` FOREIGN KEY (`usergroup_id`) REFERENCES `usergroup` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
