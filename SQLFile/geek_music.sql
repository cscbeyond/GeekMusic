/*
 Navicat Premium Data Transfer

 Source Server         : 腾讯云数据库
 Source Server Type    : MySQL
 Source Server Version : 50730
 Source Host           : 49.234.251.37:3306
 Source Schema         : geek_music

 Target Server Type    : MySQL
 Target Server Version : 50730
 File Encoding         : 65001

 Date: 18/09/2020 14:32:02
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for collections
-- ----------------------------
DROP TABLE IF EXISTS `collections`;
CREATE TABLE `collections` (
  `id` int(64) NOT NULL AUTO_INCREMENT COMMENT '递增Id',
  `songId` int(64) DEFAULT NULL COMMENT '歌曲id',
  `userId` int(64) DEFAULT NULL COMMENT '用户id',
  `date` varchar(255) DEFAULT NULL COMMENT '收藏日期',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` int(64) NOT NULL AUTO_INCREMENT COMMENT '评论的id',
  `parendId` int(64) DEFAULT NULL COMMENT '上一层评论的id',
  `userId` int(64) DEFAULT NULL COMMENT '评论的人的用户id',
  `userName` varchar(255) DEFAULT NULL COMMENT '用户名称',
  `songId` int(64) DEFAULT NULL COMMENT '歌曲id',
  `commentContent` text COMMENT '评论的内容',
  `date` varchar(255) DEFAULT NULL COMMENT '评论的日期',
  `likeCount` int(64) DEFAULT NULL COMMENT '评论的点赞数',
  `type` varchar(255) DEFAULT NULL COMMENT '1代表评论的点赞数；2代表歌曲的点赞数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for likes
-- ----------------------------
DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes` (
  `id` int(64) NOT NULL COMMENT '递增id',
  `songId` int(64) DEFAULT NULL COMMENT '歌曲Id',
  `userId` int(64) DEFAULT NULL COMMENT '用户Id',
  `date` varchar(255) DEFAULT NULL COMMENT '点赞的时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for songsList
-- ----------------------------
DROP TABLE IF EXISTS `songsList`;
CREATE TABLE `songsList` (
  `id` int(64) NOT NULL AUTO_INCREMENT COMMENT '用户id，唯一标识',
  `albumName` varchar(255) DEFAULT NULL COMMENT '专辑名称',
  `albumChinese` varchar(255) DEFAULT NULL COMMENT '中文的专辑名称',
  `fileName` varchar(255) DEFAULT NULL COMMENT '文件名称',
  `fileNameChinese` varchar(255) DEFAULT NULL COMMENT '中文的文件名称',
  `filePath` varchar(255) DEFAULT NULL COMMENT '文件的相对路径，带专辑名',
  `like` int(64) DEFAULT NULL COMMENT '点赞数',
  `comment` int(64) DEFAULT NULL COMMENT '评论数',
  `favorite` int(64) DEFAULT NULL COMMENT '收藏数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=761 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` mediumtext,
  `nickName` varchar(255) DEFAULT '',
  `last_login_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
