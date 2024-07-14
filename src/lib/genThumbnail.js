import FilePreviews from "filepreviews";

export const genThumbnail = async (filepath,storageId) => {
  var previews = new FilePreviews({
    debug: true,
    apiKey: process.env.FILEPREVIEW_API_KEY,
    apiSecret: process.env.FILEPREVIEW_API_SECRET,
  });

  previews.generate(filepath,{    
    data:{
      storageId
    }
  }, function (err, result) {
    console.log({id:result.id});
    console.log({result})

    previews.retrieve(result.id, function (err, result) {
      console.log("result:",result);
    });
  })
};
