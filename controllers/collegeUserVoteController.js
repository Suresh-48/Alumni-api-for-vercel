import User from "../models/userModel.js";
import collegeUserVoteCounter from "../models/collegeUserVoteCounterModel.js";
import collegeUserVote from "../models/collegeUserVoteModel.js";

// Base Controller
import { getAll, getOne, updateOne, deleteOne, createOne } from "./baseController.js";

export async function deleteCollegeUserVote(req, res, next) {
  try {
    const id = req.params.id;
    const data = await collegeUserVote.findOne({
      _id: id,
    });
    await collegeUserVote.findByIdAndDelete(req.params.id);
    const voteCounter = await collegeUserVoteCounter.findOne({
      userId: data.userId,
      collegeId: data.collegeId,
    });
    const voteLength = await collegeUserVote.find({
      userId: data.userId,
      collegeId: data.collegeId,
    });
    await collegeUserVoteCounter.findByIdAndUpdate(voteCounter._id, {
      $set: {
        userId: data.userId,
        collegeId: data.collegeId,
        votes: voteLength.length,
      },
    });

    res.status(204).json({
      status: "Deleted Successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}
export async function voteCreatedByUser(req, res, next) {
  try {
    const { createdBy, collegeId } = req.query;
    const findUser = await collegeUserVote.find({
      createdBy: createdBy,
      collegeId: collegeId,
    }).populate("userId");
    res.status(200).json({
      status: "success",
      results: findUser.length,
      data: {
        data: findUser,
      },
    });
  } catch {
    next(err);
  }
}

export async function createUserVotes(req, res, next) {
  try {
    //user Id
    const createdBy = req.body.createdBy;
    const userId = req.body.userId;
    const collegeId = req.body.collegeId;
    const findUser = await collegeUserVote.find({
      createdBy: createdBy,
      collegeId: collegeId,
    });
    if (findUser.length <= 2) {
      const vote = await collegeUserVote.find({
        createdBy: createdBy,
        userId: userId,
        collegeId: collegeId,
      });
      if (vote.length === 0) {
        const firstVote = await collegeUserVote.create({
          createdBy: createdBy,
          userId: userId,
          collegeId: collegeId,
        });
        const findVote = await collegeUserVoteCounter.findOne({
          userId: userId,
          collegeId: collegeId,
        });
        const voteLength = await collegeUserVote.find({
          userId: userId,
          collegeId: collegeId,
        });

        if (findVote === null) {
          const voteCounter = await collegeUserVoteCounter.create({
            userId: userId,
            collegeId: collegeId,
            votes: 1,
          });
        } else {
          const voterId = findVote._id;
          const newVote = voteLength.length;
          const update = {
            $set: {
              userId: userId,
              collegeId: collegeId,
              votes: newVote,
            },
          };
          const voteCounter = await collegeUserVoteCounter.findByIdAndUpdate(voterId, update);
        }

        res.status(200).json({
          status: "success",
          results: firstVote.length,
          message: "Your vote is added",
          data: {
            data: firstVote,
          },
        });
      } else {
        res.status(200).json({
          status: "success",
          results: vote.length,
          message: "Already Voted",
          data: {
            data: vote,
          },
        });
      }
    } else {
      res.status(200).json({
        status: "success",
        results: findUser.length,
        message: "Maximum Votes Used Already",
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function voteCounter(req, res, next) {
  try {
    const collegeId = req.query.collegeId;
    resMap(collegeId).then((item) => {
      let userInfo = new Map([...item[1].entries()].sort((a, b) => b[1] - a[1]));
      let userCountInfo = new Map([...item[0].entries()].sort((a, b) => b[1] - a[1]));

      let data = [];
      for (let [key, value] of userCountInfo) {
        data.push({ id: key, vote: value });
      }

      const userVoteDetails = [];
      data.forEach((item, i) => {
        const vv = [];
        User.findById({ _id: item.id }).then((res) => {
          vv.push({ user: res, vote: item.vote });
        });
      });

      // const userData = User.find({ _id: data.id });
      res.status(200).json({
        status: "success",
        data: data,
      });
    });
  } catch {
    next(err);
  }
}

const resMap = (collegeId) => {
  let map = new Map();
  let userInfoMap = new Map();
  let resArray = [];
  return collegeUserVote
    .find({ collegeId: collegeId }, { "userId.$": 1 })
    .distinct("userId")
    .then((vote) => {
      return collegeUserVote.find({       collegeId: collegeId,
 userId: { $in: vote } }).then((count) => {
        return User.find({ _id: { $in: vote } }).then((userInfo) => {
          vote.forEach((res, i) => {
            let countArray = [];
            const found = count.filter(function (obj) {
              if (obj.userId.toString() === res.toString()) {
                countArray.push(obj.createdBy);
                map.set(res.toString(), countArray.length);
              }
            });
            let userMap = new Map();
            const UserInformationFound = userInfo.filter(function (obj) {
              if (obj._id.toString() === res.toString()) {
                // countArray.push(obj.createdBy);
                userMap.set("userId", obj._id);
                userMap.set("userFirstName", obj.firstName);
                userMap.set("userLastName", obj.lastName);
                userMap.set("userImageUrl", obj.avatarUrl);
                userInfoMap.set(res.toString(), userMap);
              }
            });
          });
          resArray.push(map);
          resArray.push(userInfoMap);
          return resArray;
        });
        //return map;
      });
    });
};
export const getAllCOllegeUserVotes = getAll(collegeUserVote);
export const getCollegeUserVote = getOne(collegeUserVote);
export const updateCollegeUserVote = updateOne(collegeUserVote);
