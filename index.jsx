import { Image, Upload } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useImageUpload } from "../../hooks/imageUpload/imageUpload.hooks";
import { usePutDepositBankReceipt } from "../../pages/Exchange/hooks/depositReceipt.hooks";
import toast from "../ToastMessage";
import uploadStatusEnum from "./enumerations/uploadStatusEnum";
import styles from "./style.module.scss";
import "./style.scss";

const CustomUpload = ({
  filePath = "",
  depositResponse = {},
  onChangeUploadStatus = () => {},
  uploadErrorRequired = false,
}) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState([]);
  //UPLOAD RELATED STATE
  const [uploadStatus, setUploadStatus] = useState(uploadStatusEnum.REMOVED);

  const {
    mutate: uploadReceipt,
    data: uploadResult,
    error: uploadError,
    isLoading: isLoadingReceipt,
  } = useImageUpload();

  const {
    mutate: updateDepositReceipt,
    data: updateDepositReceiptResult,
    error: updateDepositError,
    isLoading: isLoadingUpdate,
  } = usePutDepositBankReceipt();

  const handleUploadImage = async (options) => {
    const form = new FormData();
    form.append("img", options.file);
    form.append("folder", `${filePath}`);
    await uploadReceipt(
      { params: form },
      {
        onSuccess: (data) => {
          options.onSuccess({
            uid: new Date().valueOf(),
            name: data.filepath.split("/").pop(),
            status: "done",
            url: data.filepath,
          });
        },
        onError: (error) => {
          options.onError(error);
          toast({ content: error, type: "error" });
        },
      },
    );
  };

  const handleUpdateDepositReceipt = async (event) => {
    const { file } = event;
    console.log("file on Change", file.status);
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      return;
    }
    onChangeUploadStatus(file.status);
    setUploadStatus(file.status);
    if (file.status === uploadStatusEnum.DONE) {
      console.log("hi its done");
      if (file?.response) {
        console.log("hi its response");

        const path = file?.response?.url;
        await updateDepositReceipt(
          {
            params: {
              order_number: depositResponse?.order_number,
              img: path,
            },
          },
          {
            onSuccess: (data) => {
              toast({ content: t("normal.success"), type: "success" });
            },
          },
        );
      }
    }
  };

  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      console.log("file.status", file);
      onChangeUploadStatus(uploadStatusEnum.REMOVED);
      setUploadStatus(uploadStatusEnum.REMOVED);
      setFileList([]);
      toast({ content: t("image.upload.warning"), type: "error" });
    } else {
      setFileList([...fileList, file]);
    }
    return isLt2M;
  };

  const onRemove = (file) => {
    setFileList([]);
    onChangeUploadStatus(uploadStatusEnum.REMOVED);
    setUploadStatus(uploadStatusEnum.REMOVED);
  };
  return (
    <Upload
      className="custom-upload"
      maxCount={1}
      accept=".png, .jpg, .jpeg"
      // showUploadList={false}
      name={"deposit-virtual-receipt"}
      customRequest={handleUploadImage}
      onChange={handleUpdateDepositReceipt}
      beforeUpload={beforeUpload}
      fileList={fileList}
      onRemove={onRemove}
    >
      {uploadStatus === uploadStatusEnum.REMOVED ? (
        <>
          <div className={`${styles.footerContainer} ${uploadErrorRequired ? styles.error : ""}`}>
            <Image
              width={70}
              height={70}
              src={"/images/exchange/icon_upload.png"}
              preview={false}
            />
            <div className={styles.title}>{t("normal.uploadScreenshot")}</div>
          </div>
          <div className={`${styles.errorMessage} ${uploadErrorRequired ? styles.error : ""}`}>
            {t("deposit.errorImage")}
          </div>
        </>
      ) : null}
    </Upload>
  );
};

export default CustomUpload;
