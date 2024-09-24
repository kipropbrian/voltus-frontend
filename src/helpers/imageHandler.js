/**
 * Helper functions
 *
 */

const dropHandler = (ev) => {
	ev.preventDefault();

	if (ev.dataTransfer.items) {
		// Use DataTransferItemList interface to access the file
		let item = ev.dataTransfer.items[0];
		// If dropped items aren't files, reject them
		if (item.kind === 'file' && (item.type === 'image/jpeg' || item.type === 'image/png')) {
			const uploadedImage = item.getAsFile();
			const imgurl = URL.createObjectURL(uploadedImage);
			return { imgurl, uploadedImage };
		}
	}
	return null;
};

//Returns css style for rectangle to draw on the faces of user supplied image.
const drawFaceRectangle = (faceData) => {
	let img = document.getElementById('canva1');
	let faceStyle = {};
	let widthPercentage = Math.abs(img.width / img.naturalWidth);
	let heightPercentage = Math.abs(img.height / img.naturalHeight);

	//Generate styles from facedata
	faceData.map((face, k) => {
		let name = 'face'.concat(k + 1);
		faceStyle[name] = {
			position: 'absolute',
			border: '1px solid skyblue',
			'z-index': '1',
			// transform: rotateZ(6.97501deg);
			width: face.face_rectangle.width * widthPercentage + 'px',
			height: face.face_rectangle.height * heightPercentage + 'px',
			left: face.face_rectangle.left * widthPercentage + 'px',
			top: face.face_rectangle.top * heightPercentage + 'px',
		};
	});

	return faceStyle;
};

const checkSize = (uploadedImage) => {
	//check if image is larger than 2MB
	const MAX_UPLOAD_SIZE = 2; //In MB
	if (uploadedImage.size < 1024 * 1024 * MAX_UPLOAD_SIZE) {
		return true;
	} else {
		//set alert
		console.log('The uploaded image is too big', uploadedImage.size);
		return false;
	}
};

const updateImage = (e) => {
	let files = e.target.files || e.dataTransfer.files;
	if (!files.length) {
		return;
	}
	const imgurl = URL.createObjectURL(files[0]);
	const uploadedImage = files[0];
	return { imgurl, uploadedImage };
};

const getThumbnailUrl = (person) => {
	if (!person.images) {
		return person.gender == 'Male' ? '/man-icon.png' : '/woman-icon.png';
	} else {
		return person.images[0].transformed_url;
	}
};

export { checkSize, updateImage, drawFaceRectangle, dropHandler, getThumbnailUrl };
