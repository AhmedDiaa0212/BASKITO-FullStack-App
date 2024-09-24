const sliderServices = require("../services/sliders.services");
const upload = require("../middleware/slider.uploads");

exports.create = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);
        }
        else {
            const path =
                req.file != undefined ? req.path.replace(/\\/g, "/") : "";
            var model = {
                sliderName: req.body.sliderName,
                sliderDescription: req.body.sliderDescription,
                sliderImage: path != "" ? "/" + path : ""
            };

            sliderServices.createSlider(model, (error, results) => {
                if (error) {
                    return next(error);
                }
                return res.status(200).send({
                    message: "Success",
                    data: results,
                });
            });
        }
    })
}


exports.findAll = (req, res, next) => {
    var model = {
        sliderName: req.query.sliderName,
        pageSize: req.query.pageSize,
        page: req.query.page,
    };

    sliderServices.getSliders(model, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}

exports.findOne = (req, res, next) => {
    var model = {
        sliderId: req.params.id,
    };

    sliderServices.getSliderById(model, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}

exports.update = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);
        }
        else {
            const path =
                req.file != undefined ? req.path.replace(/\\/g, "/") : "";
            var model = {
                sliderId: req.params.id,
                sliderName: req.body.sliderName,
                sliderDescription: req.body.sliderDescription,
                sliderImage: path != "" ? "/" + path : ""
            };

            sliderServices.updateSlider(model, (error, results) => {
                if (error) {
                    return next(error);
                }
                return res.status(200).send({
                    message: "Success",
                    data: results,
                });
            });
        }
    })
}

exports.delete = (req, res, next) => {
    var model = {
        sliderId: req.params.id,
    };

    sliderServices.deleteSlider(model, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}