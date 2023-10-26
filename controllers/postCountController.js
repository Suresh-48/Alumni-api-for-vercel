import postCount from "../models/postCount.js";
import knowledgeSharing from '../models/knowledgeSharingModel.js'


export async function createPostCount(req, res, next) {
  try {
    //user Id
    const userId = req.body.userId;
    const postId = req.body.postId;

    const findUser = await postCount.find({
      userId: userId,
      postId: postId,
    });

    if (findUser.length === 0) {
      const data = await postCount.create({
        userId: userId,
        postId: postId,
      });
      const findCount = await postCount.findOne({
        userId: userId,
        postId: postId,
      });
        const postLength = await postCount.find({
          postId: postId,
        });

      const newCount=postLength.length
         
      await knowledgeSharing.findByIdAndUpdate(postId, {
            $set: {
            count:newCount
            },
          })
        res.status(200).json({
        status:"success",
        message:'You Liked The Post',
        data:{
        data:findCount
        }
  })
  }else {
     const userId = req.body.userId;
     const postId = req.body.postId;

     const data = await postCount.findOne({
       userId: userId,
       postId: postId,
     });

     await postCount.findByIdAndDelete(data._id);

     const postLength = await postCount.find({
       postId: postId,
     });

     const newCount = postLength.length;

     await knowledgeSharing.findByIdAndUpdate(postId, {
       $set: {
         count: newCount,
       },
     });
     res.status(200).json({
       status: "success",
       message: "You Disliked The Post",
       data: {
         data: null,
       },
     });
    }
  }
   catch (err) {
    next(err);
  }
}

