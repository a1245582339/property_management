/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50720
 Source Host           : localhost:3306
 Source Schema         : property_management

 Target Server Type    : MySQL
 Target Server Version : 50720
 File Encoding         : 65001

 Date: 17/10/2018 23:24:25
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
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin_token
-- ----------------------------
INSERT INTO `admin_token` VALUES (8, '1536316910276tokenddd', 1536921710276, 1);
INSERT INTO `admin_token` VALUES (9, '1536906504242tokenddd', 1537511304242, 1);
INSERT INTO `admin_token` VALUES (10, '1539516058550tokenddd', 1540120858550, 1);

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
INSERT INTO `admin_user` VALUES (1, 'ddd', '0b4e7a0e5fe84ad35fb5f95b9ceeac79', 2, 0);
INSERT INTO `admin_user` VALUES (2, 'fff', '0b4e7a0e5fe84ad35fb5f95b9ceeac79', 1, 0);

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
  `status` int(1) NOT NULL COMMENT '0：已撤消\r\n1：已报修\r\n2：已联系\r\n3：已派修\r\n4：已维修\r\n5：已缴费',
  `photos` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `price` float(10, 2) NULL DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `create_time` varchar(13) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `appointment_time` varchar(13) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '派修时间',
  `pay_time` varchar(13) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '支付时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of repair_list
-- ----------------------------
INSERT INTO `repair_list` VALUES (1, 'title test', 0, '', NULL, 1, '1536751006000', NULL, NULL);
INSERT INTO `repair_list` VALUES (7, '测试', 0, NULL, NULL, 1, '1544444444444', NULL, NULL);
INSERT INTO `repair_list` VALUES (8, '不知道啥玩意坏了', 2, NULL, NULL, 1, '1555555555555', NULL, '1538890692057');
INSERT INTO `repair_list` VALUES (29, '测试', 3, '[\"/img/repair153889045376411987.png\"]', NULL, 1, '1538890457496', NULL, NULL);
INSERT INTO `repair_list` VALUES (30, '测试1', 5, '[\"/img/repair153889059018213784.png\",\"/img/repair153889059018214899.png\"]', 20.00, 1, '1538890591262', NULL, '1538890892765');
INSERT INTO `repair_list` VALUES (31, '测试新增', 1, '[\"/img/repair153889087536812713.png\",\"/img/repair153889087536815888.png\"]', NULL, 1, '1538890876510', NULL, NULL);

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
INSERT INTO `room` VALUES (5, '101a', '2', 50);
INSERT INTO `room` VALUES (6, '102a', '2', 50);
INSERT INTO `room` VALUES (7, '201a', '2', 60);
INSERT INTO `room` VALUES (8, '202a', '2', 60);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nick_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sex` int(1) NOT NULL COMMENT '0：男\r\n1：女',
  `room_id` int(11) NOT NULL,
  `role` int(1) NOT NULL DEFAULT 0 COMMENT '0：未审核\r\n1：家庭成员\r\n2：业主\r\n\r\n',
  `isDel` int(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '0：未删\r\n1：已删\r\n',
  `tel` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 't1', '王穷鬼', '0b4e7a0e5fe84ad35fb5f95b9ceeac79', 1, 1, 2, 0, '15444444445');
INSERT INTO `user` VALUES (2, 't2', '张百万', '4693fbb215b8ca15a6900f0cfa164cdc', 1, 1, 1, 1, '15555555555');
INSERT INTO `user` VALUES (3, 't3', '萌新', '0b4e7a0e5fe84ad35fb5f95b9ceeac79', 0, 1, 1, 0, '13258787777');
INSERT INTO `user` VALUES (13, 't4', '铁锤妹妹', '0b4e7a0e5fe84ad35fb5f95b9ceeac79', 0, 1, 1, 1, '13555555555');
INSERT INTO `user` VALUES (16, 't6666', '测试新增', '0b4e7a0e5fe84ad35fb5f95b9ceeac79', 0, 1, 1, 0, '13333333333');

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
) ENGINE = InnoDB AUTO_INCREMENT = 139 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_token
-- ----------------------------
INSERT INTO `user_token` VALUES (112, '1538883201281tokent1', '1539488001281', 1);
INSERT INTO `user_token` VALUES (113, '1538883258070tokent1', '1539488058070', 1);
INSERT INTO `user_token` VALUES (114, '1538883399688tokent1', '1539488199688', 1);
INSERT INTO `user_token` VALUES (115, '1538883401154tokent1', '1539488201154', 1);
INSERT INTO `user_token` VALUES (116, '1538883428355tokent1', '1539488228355', 1);
INSERT INTO `user_token` VALUES (117, '1538883526046tokent1', '1539488326046', 1);
INSERT INTO `user_token` VALUES (118, '1538884558670tokent1', '1539489358670', 1);
INSERT INTO `user_token` VALUES (119, '1538885192336tokent1', '1539489992336', 1);
INSERT INTO `user_token` VALUES (120, '1538886113931tokent1', '1539490913931', 1);
INSERT INTO `user_token` VALUES (121, '1538886336066tokent1', '1539491136066', 1);
INSERT INTO `user_token` VALUES (122, '1538886339871tokent1', '1539491139871', 1);
INSERT INTO `user_token` VALUES (123, '1538886349684tokent1', '1539491149684', 1);
INSERT INTO `user_token` VALUES (124, '1538886385442tokent1', '1539491185442', 1);
INSERT INTO `user_token` VALUES (125, '1538886393897tokent1', '1539491193897', 1);
INSERT INTO `user_token` VALUES (126, '1538886396169tokent1', '1539491196169', 1);
INSERT INTO `user_token` VALUES (127, '1538886624235tokent1', '1539491424235', 1);
INSERT INTO `user_token` VALUES (128, '1538887431918tokent1', '1539492231918', 1);
INSERT INTO `user_token` VALUES (129, '1538887524435tokent1', '1539492324435', 1);
INSERT INTO `user_token` VALUES (130, '1538887613813tokent1', '1539492413813', 1);
INSERT INTO `user_token` VALUES (131, '1538888636248tokent1', '1539493436248', 1);
INSERT INTO `user_token` VALUES (132, '1538890825270tokent1', '1539495625270', 1);
INSERT INTO `user_token` VALUES (133, '1538891192223tokent6666', '1539495992223', 16);
INSERT INTO `user_token` VALUES (134, '1538891224945tokent6666', '1539496024945', 16);
INSERT INTO `user_token` VALUES (135, '1538891301430tokent6666', '1539496101430', 16);
INSERT INTO `user_token` VALUES (136, '1538891310184tokent1', '1539496110184', 1);
INSERT INTO `user_token` VALUES (137, '1538891321427tokent6666', '1539496121427', 16);
INSERT INTO `user_token` VALUES (138, '1539501785236tokent1', '1540106585236', 1);

SET FOREIGN_KEY_CHECKS = 1;
