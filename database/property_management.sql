/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50723
 Source Host           : localhost:3306
 Source Schema         : property_management

 Target Server Type    : MySQL
 Target Server Version : 50723
 File Encoding         : 65001

 Date: 02/10/2018 21:11:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin_token
-- ----------------------------
DROP TABLE IF EXISTS `admin_token`;
CREATE TABLE `admin_token`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `deadline` bigint(13) NOT NULL,
  `admin_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin_token
-- ----------------------------
INSERT INTO `admin_token` VALUES (8, '1536316910276tokenddd', 1536921710276, 1);
INSERT INTO `admin_token` VALUES (9, '1536906504242tokenddd', 1537511304242, 1);

-- ----------------------------
-- Table structure for admin_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `role` int(1) NOT NULL COMMENT '1：超级管理员\r\n2：管理员',
  `isDel` int(1) UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin_user
-- ----------------------------
INSERT INTO `admin_user` VALUES (1, 'ddd', '000000', 2, 0);
INSERT INTO `admin_user` VALUES (2, 'fff', '000000', 1, 0);

-- ----------------------------
-- Table structure for part
-- ----------------------------
DROP TABLE IF EXISTS `part`;
CREATE TABLE `part`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `part_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `price` float(10, 2) NOT NULL,
  `type_id` int(11) NOT NULL,
  `isDel` int(11) NOT NULL DEFAULT 0,
  `count` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of part
-- ----------------------------
INSERT INTO `part` VALUES (4, '3mm螺丝', 2.00, 1, 0, 0);
INSERT INTO `part` VALUES (5, '5mm螺丝', 2.00, 1, 0, 0);
INSERT INTO `part` VALUES (6, '5cm地漏', 5.00, 2, 0, 0);

-- ----------------------------
-- Table structure for part_order
-- ----------------------------
DROP TABLE IF EXISTS `part_order`;
CREATE TABLE `part_order`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repair_id` int(11) NOT NULL,
  `part_id` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of part_order
-- ----------------------------
INSERT INTO `part_order` VALUES (1, 2, 1, 50);
INSERT INTO `part_order` VALUES (2, 2, 3, 50);
INSERT INTO `part_order` VALUES (3, 2, 4, 50);

-- ----------------------------
-- Table structure for part_type
-- ----------------------------
DROP TABLE IF EXISTS `part_type`;
CREATE TABLE `part_type`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `isDel` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of part_type
-- ----------------------------
INSERT INTO `part_type` VALUES (1, '螺丝', 1);
INSERT INTO `part_type` VALUES (2, '地漏', 0);

-- ----------------------------
-- Table structure for repair_list
-- ----------------------------
DROP TABLE IF EXISTS `repair_list`;
CREATE TABLE `repair_list`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` int(1) NOT NULL COMMENT '1：已报修\r\n2：已联系\r\n3：已派修\r\n4：已维修\r\n5：已缴费',
  `photos` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `price` float(10, 2) NULL DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `create_time` varchar(13) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `appointment_time` varchar(13) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '派修时间',
  `pay_time` varchar(13) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '支付时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of repair_list
-- ----------------------------
INSERT INTO `repair_list` VALUES (1, 'title test', 1, NULL, NULL, 1, '1536751006000', NULL, NULL);
INSERT INTO `repair_list` VALUES (2, 'test2', 4, NULL, 50.00, 2, '1536800973000', '1536887373000', NULL);
INSERT INTO `repair_list` VALUES (3, '测试请求', 2, '', 100.50, 1, '1536828608300', '1536834820116', '1536892823306');
INSERT INTO `repair_list` VALUES (6, '接口文档测试数据', 1, '', NULL, 2, '1536920849913', NULL, NULL);

-- ----------------------------
-- Table structure for room
-- ----------------------------
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_num` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `building` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `area` float(255, 0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of room
-- ----------------------------
INSERT INTO `room` VALUES (1, '101', '1', 50);
INSERT INTO `room` VALUES (2, '102', '1', 50);
INSERT INTO `room` VALUES (3, '201', '1', 60);
INSERT INTO `room` VALUES (4, '202', '1', 60);
INSERT INTO `room` VALUES (5, '101', '2', 50);
INSERT INTO `room` VALUES (6, '102', '2', 50);
INSERT INTO `room` VALUES (7, '201', '2', 60);
INSERT INTO `room` VALUES (8, '202', '2', 60);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sex` int(1) NOT NULL COMMENT '0：男\r\n1：女',
  `room_id` int(11) NOT NULL,
  `role` int(1) NOT NULL COMMENT '1：业主\r\n2：家庭成员\r\n\r\n',
  `isDel` int(1) UNSIGNED ZEROFILL NOT NULL COMMENT '0：未删\r\n1：已删\r\n',
  `tel` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 't1', '111111', 1, 1, 2, 0, '1321');
INSERT INTO `user` VALUES (2, '请sada', '123', 1, 2, 1, 0, '2132');
INSERT INTO `user` VALUES (3, 'dad', '23', 0, 2, 1, 0, '132');

-- ----------------------------
-- Table structure for user_token
-- ----------------------------
DROP TABLE IF EXISTS `user_token`;
CREATE TABLE `user_token`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `deadline` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_token
-- ----------------------------
INSERT INTO `user_token` VALUES (1, '1536914118727tokendad', '1537518918727', 3);
INSERT INTO `user_token` VALUES (2, '1537174273237tokendad', '1537779073237', 3);
INSERT INTO `user_token` VALUES (3, '1537174412974tokendad', '1537779212974', 3);
INSERT INTO `user_token` VALUES (4, '1537695452269tokent1', '1538300252269', 1);
INSERT INTO `user_token` VALUES (5, '1537695765739tokent1', '1538300565739', 1);
INSERT INTO `user_token` VALUES (6, '1537696807136tokent1', '1538301607136', 1);
INSERT INTO `user_token` VALUES (7, '1537704226232tokent1', '1538309026232', 1);
INSERT INTO `user_token` VALUES (8, '1537705159627tokent1', '1538309959627', 1);
INSERT INTO `user_token` VALUES (9, '1537705173726tokent1', '1538309973726', 1);
INSERT INTO `user_token` VALUES (10, '1537705246289tokent1', '1538310046289', 1);
INSERT INTO `user_token` VALUES (11, '1537705296705tokent1', '1538310096705', 1);
INSERT INTO `user_token` VALUES (20, '1537710382551tokent1', '1538315182551', 1);
INSERT INTO `user_token` VALUES (21, '1537799197509tokent1', '1538403997509', 1);

SET FOREIGN_KEY_CHECKS = 1;
