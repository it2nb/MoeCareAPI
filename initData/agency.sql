-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 06, 2024 at 04:23 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moecaredb`
--

--
-- Dumping data for table `agency`
--

INSERT INTO `agency` (`agencyID`, `agencyName`, `agencyCode`) VALUES
(2, 'สำนักงานรัฐมนตรี', '001'),
(3, 'สำนักงานปลัดกระทรวงศึกษาธิการ', '002'),
(4, 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)', '003'),
(5, 'สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)', '004'),
(6, 'สำนักงาน ก.ค.ศ.', '005'),
(7, 'สำนักงานบริหารการศึกษาเอกชน (สช.)', '006'),
(8, 'กรมส่งเสริมการเรียนรู้', '007'),
(9, 'สำนักงานครุสภา', '008');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
