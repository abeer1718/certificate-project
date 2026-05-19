-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2026 at 05:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gold_certificates`
--

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `alloy_weight` varchar(50) DEFAULT NULL,
  `alloy_carat` varchar(50) DEFAULT NULL,
  `net_weight` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `certificate_no` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificates`
--

INSERT INTO `certificates` (`id`, `user_id`, `date`, `serial_number`, `alloy_weight`, `alloy_carat`, `net_weight`, `created_at`, `certificate_no`) VALUES
(1, NULL, '0000-00-00', '3232', '23223', '23', '23', '2026-05-15 18:20:24', '325'),
(2, NULL, '0000-00-00', '232', '2323', '232', '232', '2026-05-15 18:35:50', '345'),
(3, NULL, '0000-00-00', '2323', '2323', '232', '2323', '2026-05-15 18:42:00', '3456'),
(4, NULL, '2026-05-15', '2121', '211', '21', '211', '2026-05-15 18:51:42', '787'),
(13, NULL, '2026-05-15', '232', '32', '23', '2323', '2026-05-15 19:21:20', '679'),
(15, NULL, '2026-05-15', '232', '32', '23', '2323', '2026-05-15 19:23:38', '98'),
(16, NULL, '2026-05-19', '6456564', '564', '56', '56', '2026-05-15 19:24:31', '89'),
(17, NULL, '2026-05-03', '543', '345', '45', '43534', '2026-05-15 19:33:08', '67'),
(18, NULL, '2026-05-03', 'try', '433', '34', '3434', '2026-05-15 19:40:38', '56'),
(19, NULL, '2026-05-16', '121212', '12', '21', '21', '2026-05-16 04:56:31', '546'),
(24, NULL, '2026-05-03', '547', '765', '67', '67', '2026-05-16 11:42:42', '56'),
(25, NULL, '2026-05-02', '12435', '23', '21', '1244', '2026-05-16 12:05:52', '56'),
(26, 2, '2026-05-02', '567567', '657', '5675', '567', '2026-05-16 12:16:13', '65'),
(27, 2, '2026-05-02', '4535', '5435', '453', '34543', '2026-05-16 12:18:43', '11'),
(29, 2, '2026-05-02', '5345', '753', '54', '543', '2026-05-16 12:51:22', '11'),
(30, 2, '2026-05-02', '123', '213', '23', '213', '2026-05-16 12:51:49', '11'),
(31, 3, '2026-05-01', '000987623541', '1.2', '2pk.154', '1200', '2026-05-16 14:55:08', '00125'),
(32, 3, '2026-05-08', '25', '1', 'gh21fg', '1000', '2026-05-16 15:12:12', '14');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `role`, `created_at`) VALUES
(2, 'خالد', '$2a$10$Pdbx4ENQOeZ3pf8gCC0kYOPDmQJy0U1/.cE7DTvt1i.QaKnuIlaC2', 'خالد محمد', 'user', '2026-05-16 12:12:02'),
(3, 'kian24', '$2a$10$IcH1lMCVYCloe/XNs2glwe8zixcl.oLx3OSsPGZ10kg/eIiGbAkG.', 'kian', 'user', '2026-05-16 14:53:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
