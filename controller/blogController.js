const blogModel = require("../models/blogModel.js");
const userModel = require("../models/userModel.js");
const mongoose = require("mongoose");


exports.getAllBlogsController = async (req, res) => {

    try {
        const blogs = await blogModel.find({}).populate("user");
        if (!blogs) {
            return res.status(200).send({
                success: false,
                message: "No Blogs Found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "List of all blogs ",
            blogsCount: blogs.length,

            blogs,
        })

    }
    catch (error) {
        console.log(error);

        return res.status(400).send({
            success: false,
            message: "Error While getting the  Blogs",
            error
        })
    }
}

exports.createBlogController = async (req, res) => {
    try {
        const { title, description, image, user } = req.body;
        if (!title || !description || !image || !user) {
            return res.status(200).send({
                success: false,
                message: "Please fill all the fields ",

            })
        }
        const existingUser = await userModel.findById(user);
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: "Unable to find User"
            })
        }




        const newBlog = new blogModel({ title, description, image, user });
        const session = await mongoose.startSession();
        session.startTransaction();

        await newBlog.save({ session });
        existingUser.blogs.push(newBlog)

        await existingUser.save({ session })

        await session.commitTransaction();

        await newBlog.save();

        return res.status(201).send({
            success: true,
            message: "blog created successfully",
            newBlog
        })
    }
    catch (error) {
        console.log(error);

        return res.status(400).send({
            success: true,
            message: "Error while creating the model ",
            error

        })
    }
}

exports.getBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        if (!blog) {
            return res.status(200).send({
                success: false,
                message: "Blog not found ",

            })
        }

        return res.status(201).send({
            success: true,
            message: "Blog Not found",
            blog
        })


    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "Error while getting the blog ",
            error
        })

    }
}

exports.updateBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image } = req.body;

        const blog = await blogModel.findByIdAndUpdate(id, { ...req.body }, { new: true });
        res.status(200).send({
            success: true,
            message: "Updated Blog",
            blog
        })
    }
    catch (error) {
        console.log(error);

        return res.status(400).send({
            success: false,
            message: "Error while updating the blog",
            error
        })
    }



}

exports.deleteBlogController = async (req, res) => {
    try {
        await blogModel.findByIdAndDelete(req.params.id);
        return res.status(201).send({
            success: true,
            message: "Blog deleted"
        })




    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while deleting"
        })

    }




}


exports.userBlogController = async (req, res) => {
    try {
        const userBlog = await userModel.findById(req.params.id).populate("blogs");

        if (!userBlog) {
            return res.status(404).send({
                success: false,
                message: 'blogs not found with this id '
            })
        }



        return res.status(200).send({
            success: true,
            message: "User Blogs",
            userBlog
        })


    }
    catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: 'error in user blog ',
            error
        })

    }
}
exports.getBlogByIdController = async (req, res) => {
    try {
        //const {id} = req.params.id;
        const blog = await blogModel.findById(req.params.id);

        if (!blog) {
            return res.status(200).send({
                success: false,
                message: "BLog Not found with this id "
            })
        }

        return res.status(201).send({
            success: true,
            message: " Blog Found ",
            blog
        })


    }
    catch (error) {
        return res.status(400).send({
            success: false,
            message: "Error while getting the blog"
        })
    }
}