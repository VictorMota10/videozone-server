import { uploadVideoService } from "../Services/VideoService/uploadVideoService";

export default {
  key: "VideoUpload",
  async handle({ data }: { data: any }) {
    try {
      const { uuid } = data.data;
      await new uploadVideoService()
        .execute(uuid, data.files[0])
        .then(async (url: any) => {
          await new uploadVideoService()
            .saveThumbFirebase(data.files[1], uuid)
            .then(async (UrlThumbInFirebase: any) => {
              await new uploadVideoService().updateUrlPostgres(
                uuid,
                url,
                UrlThumbInFirebase
              );

              return;
            });
        });

      return;
    } catch (error) {
      throw Error(`${error}`);
    }
  },
};
