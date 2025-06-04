-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 12, 2024 at 09:03 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `demowebsite`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `category_name` text NOT NULL,
  `category_image` text NOT NULL,
  `category_show` int(11) DEFAULT 1,
  `category_hightlight` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `category_name`, `category_image`, `category_show`, `category_hightlight`) VALUES
(1, 'Test1', 'https://media.discordapp.net/attachments/1178225356499603486/1178225396043493486/p1.png?ex=65755ee8&amp;is=6562e9e8&amp;hm=01646f86d75e073e2fd77ba68b0c1244abbd2ebc12dade23cb8dafcb9a0b9bbe&amp;=&amp;format=webp&amp;width=1800&amp;height=375', 1, 0),
(2, 'Test2', 'https://media.discordapp.net/attachments/1178225356499603486/1178225396043493486/p1.png?ex=65755ee8&amp;is=6562e9e8&amp;hm=01646f86d75e073e2fd77ba68b0c1244abbd2ebc12dade23cb8dafcb9a0b9bbe&amp;=&amp;format=webp&amp;width=1800&amp;height=375', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `itemname` text NOT NULL,
  `price` int(11) NOT NULL DEFAULT 0,
  `des` text NOT NULL,
  `balance` int(11) NOT NULL DEFAULT 0,
  `product` text NOT NULL DEFAULT '0',
  `sold` int(11) NOT NULL DEFAULT 0,
  `product_image` text NOT NULL,
  `category_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `itemname`, `price`, `des`, `balance`, `product`, `sold`, `product_image`, `category_name`) VALUES
(1, 'Test1', 200, 'Test01', 200, '0', 200, 'https://cdn.discordapp.com/attachments/1178032838189260901/1178227379093651466/83_20231126135426.png?ex=657560c1&amp;is=6562ebc1&amp;hm=ddeadee70b33168d4371dc9af50278f8b0c61f37eefc01fbcc45f1c0dbd55119&amp', 'Test1');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `pin` int(255) DEFAULT NULL,
  `point` int(255) NOT NULL DEFAULT 0,
  `pointtotal` int(255) NOT NULL DEFAULT 0,
  `group_name` varchar(255) NOT NULL DEFAULT 'user',
  `createdAt` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `pin`, `point`, `pointtotal`, `group_name`, `createdAt`) VALUES
(1, '1', '1', 1, 0, 0, 'user', '2024-02-12'),
(2, 'admin', '$2a$10$0SVbDAVhgvp.3gGPnMSHTeYMDMj38f0LAMvQ9k346wSe2LKYIWsqO', 123456, 9999, 0, 'admin', '2024-02-12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
