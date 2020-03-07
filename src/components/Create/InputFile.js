import React from 'react';
import photo from './assets/photo-camera.png';

const InputFile = (props) => {
  const {
    id,
    file,
    previewSrc,
    event,
    errors,
    validation
  } = props;
  return (
    <div className={`upload-${id}`}>
      <label htmlFor={`create-cocktail-${id}`} className={`${validation(errors)}`}>
        <div className="preview-pic">
          <img src={previewSrc} alt="" ref={file} />
        </div>
        <img src={photo} alt="Upload Area" />
        <input
          type="file"
          id={`create-cocktail-${id}`}
          accept=".jpg, .jpeg"
          onChange={(e) => event(e)}
        />
        <p className="create-remind">{errors}</p>
      </label>
    </div>
  );
};

export default InputFile;
