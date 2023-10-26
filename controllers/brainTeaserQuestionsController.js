import BrainTeaserQuestions from "../models/brainTeaserQuestionsModel.js";
import BrainTeaser from "../models/brainTeaserModel.js";
import mongoose from "mongoose";
import fs from "fs";
import csv from "csvtojson";

// Base Controller
import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "./baseController.js";

export async function uploadBrainTeaserQuestions(req, res, next) {
  try {
    importCsvData2MongoDB(req.file.path);
    function importCsvData2MongoDB(filePath) {
      csv()
        .fromFile(filePath)
        .then((questionList) => {
          questionList.forEach(async (data) => {
            const datas = await BrainTeaserQuestions.find({
              category: data.name,
              question: data.question,
            });
            const listLength = datas.length;
            {
              listLength === 0 ? await BrainTeaserQuestions.create(data) : null;
            }
          });
          fs.unlinkSync(filePath);
        });
    }
    res.json({
      message: "File uploaded/import successfully!",
      file: req.file,
    });
  } catch (err) {
    next(err);
  }
}

export async function getRandomQuestions(req, res, next) {
  try {
    const data = req.query;
    let n = 10;
    const usersQuestion = await BrainTeaser.find({
      userId: data.userId,
      category: data.category,
    });

    // let randomData = await BrainTeaserQuestions.find({
    //   category: data.category,
    // });

    const questionDetail = [];

    usersQuestion.forEach((detail) => {
      detail.answers.forEach((result) => {
        if (result.result === true) {
          questionDetail.push(result.questionId);
        }
      });
    });

    const randomData = await BrainTeaserQuestions.find({
      category: data.category,
      _id: { $nin: questionDetail },
    });

    if (randomData.length >= 10) {
      const list = randomData.sort(() => 0.5 - Math.random()).slice(0, n);

      res.json({
        message: "Questions For Brain Teaser",
        length: list.length,
        list,
      });
    } else {
      const dataList = await BrainTeaserQuestions.find({
        category: data.category,
      });
      const list = dataList.sort(() => 0.5 - Math.random()).slice(0, n);

      res.json({
        message: "Questions For Brain Teaser",
        length: list.length,
        list,
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getCategoryList(req, res, next) {
  try {
    const categoryList = await BrainTeaserQuestions.distinct("category");

    res.json({
      message: "Category List",
      categoryList,
    });
  } catch (err) {
    next(err);
  }
}

export const createBrainTeaserQuestions = createOne(BrainTeaserQuestions);
export const getAllBrainTeaserQuestions = getAll(BrainTeaserQuestions);
export const getBrainTeaserQuestions = getOne(BrainTeaserQuestions);
export const updateBrainTeaserQuestions = updateOne(BrainTeaserQuestions);
export const deleteBrainTeaserQuestions = deleteOne(BrainTeaserQuestions);
