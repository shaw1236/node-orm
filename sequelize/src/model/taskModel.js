'use strict';

// Load the enviroment variables to process from .env
//require('dotenv').config()
import dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.DATABASEURL;

//const Sequelize = require("sequelize");
//const {DataTypes: DataType} from "sequelize";
import {Sequelize, DataTypes as DataType} from "sequelize";

const sequelize = new Sequelize(databaseUrl, {
    define: {
      freezeTableName: true
    },
    logging: console.log
});

const TaskModel = sequelize.define('tasks', {
    id: {
           type: DataType.INTEGER,
           allowNull: false,
           primaryKey: true,
           autoIncrement: true
    }, 
	
	title: {
        type: DataType.STRING,
        allowNull: false,
	},

	description: {
        type: DataType.STRING,
	},

	done: {
        type: DataType.BOOLEAN,
        defaultValue: false
    }
});

//module.exports = {TaskModel};
export default TaskModel;
