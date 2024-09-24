const { slider } = require("../models/slider.model");
const { MONG0_DB_CONFIG } = require("../config/app.config");

async function createSlider(params, callback) {
    if (!params.sliderNameName) {
        return callback(
            {
                message: "slider Name Required"
            },
            ""
        );
    }

    const sliderModel = new slider(params);
    sliderModel
        .save()
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function getSliders(params, callback) {
    const sliderName = params.sliderName;
    var condition = sliderName ?
        {
            sliderName: { $regex: new RegExp(sliderName), $options: "i" }
        }
        : {};
    let perPage = Math.abs(params.pageSize) || MONG0_DB_CONFIG.PAGE_SIZE;
    let page = (Math.abs(params.page) || 1) - 1

    slider
        .find(condition, "sliderName sliderImage")
        .limit(perPage)
        .skip(perPage * page)
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function getSliderById(params, callback) {
    const sliderId = params.sliderId;

    slider
        .findById(sliderId)
        .then((response) => {
            if (!response) callback("Not found slider with id" + sliderId);
            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function updateSlider(params, callback) {
    const sliderId = params.sliderId;

    slider
        .findByIdAndUpdate(sliderId, params, {useFindAndModify: false})
        .then((response) => {
            if (!response) callback("Not found slider with id" + sliderId);
            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

async function deleteSlider(params, callback) {
    const sliderId = params.sliderId;

    slider
        .findByIdAndDelete(sliderId)
        .then((response) => {
            if (!response) callback("Not found slider with id" + sliderId);
            else callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}

module.exports = {
    createSlider,
    getSliders,
    getSliderById,
    updateSlider,
    deleteSlider
  }