const Vendor = require("../models/Vendor");
const { Op } = require("sequelize");
const { generateVendorCode } = require("../utils/codeGenerator");

// Create Vendor
const createVendor = async (req, res) => {
  try {
    const {
      vendorName,
      contactPerson,
      phone,
      email,
      address,
      gst,
      categories,
      status,
    } = req.body;

    // Required validation
    if (!vendorName || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Duplicate email check
    const existingVendor = await Vendor.findOne({ where: { email } });
    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: "Vendor already exists",
      });
    }

    // ✅ AUTO-GENERATE vendorCode
    const vendorCode = await generateVendorCode();

    const vendor = await Vendor.create({
      vendorCode,
      vendorName,
      contactPerson,
      phone,
      email,
      address,
      gst,
      categories,
      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      data: vendor,
    });
  } catch (error) {
    console.error("Create Vendor Error:", error);
    
    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: "Vendor code or email already exists",
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get All Vendors
const getVendors = async (req, res) => {
  try {
    const {
      search = "",
      status,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { vendorName: { [Op.iLike]: `%${search}%` } },
        { vendorCode: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { rows: vendors, count } = await Vendor.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [[sortBy, order]],
    });

    return res.status(200).json({
      success: true,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / limit),
      data: vendors,
    });
  } catch (error) {
    console.error("Get Vendors Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendors",
    });
  }
};

// Get vendor by ID
const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    // ID validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Vendor ID is required",
      });
    }

    const vendor = await Vendor.findByPk(id, {
      attributes: [
        "id",
        "vendorCode",
        "vendorName",
        "contactPerson",
        "phone",
        "email",
        "address",
        "gst",
        "categories",
        "status",
        "createdAt",
      ],
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    console.error("Get Vendor By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor",
    });
  }
};

// Update vendor
const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      vendorName,
      contactPerson,
      phone,
      email,
      address,
      gst,
      categories,
      status,
    } = req.body;

    // Vendor existence check
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // email validation
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      // duplicate email check
      const existingVendor = await Vendor.findOne({
        where: {
          email,
          id: { [Op.ne]: id },
        },
      });

      if (existingVendor) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    await vendor.update({
      vendorName,
      contactPerson,
      phone,
      email,
      address,
      gst,
      categories,
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: vendor,
    });
  } catch (error) {
    console.error("Update Vendor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update vendor",
    });
  }
};

// Delete vendor
const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found or already deleted",
      });
    }

    await vendor.update({
      isDeleted: true,
      deletedAt: new Date(),
      // deletedBy: req.user.id  // (if auth implemented)
    });

    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    console.error("Delete Vendor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete vendor",
    });
  }
};

// Update vendor status
const updateVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["active", "inactive"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const vendor = await Vendor.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    await vendor.update({
      status,
      statusUpdatedAt: new Date(),
      // statusUpdatedBy: req.user.id
    });

    return res.status(200).json({
      success: true,
      message: "Vendor status updated successfully",
      data: {
        id: vendor.id,
        status: vendor.status,
      },
    });
  } catch (error) {
    console.error("Update Vendor Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update vendor status",
    });
  }
};

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  updateVendorStatus,
};
