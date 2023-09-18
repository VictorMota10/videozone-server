import { uploadVideoService } from "../Services/VideoService/uploadVideoService";

export default {
  key: "VideoUpload",
  async handle({ data }: { data: any }) {
    try {
      await new uploadVideoService()
        .createVideoOnPostgres(data.uuidVideo, data.data)
        .then( async () => {
          await new uploadVideoService()
            .execute(data.uuidVideo, data.files[0])
            .then(async (url: any) => {
              await new uploadVideoService()
                .saveThumbFirebase(data.files[1], data.uuidVideo)
                .then(async (UrlThumbInFirebase: any) => {
                  await new uploadVideoService().updateUrlPostgres(
                    data.uuidVideo,
                    url,
                    UrlThumbInFirebase,
                  );

                  return;
                });
            });
        });

      return;
    } catch (error) {
      throw Error(`${error}`);
    }
  },
};
