/**
 * Helper functions
 * 
 */

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

export { checkSize, updateImage}