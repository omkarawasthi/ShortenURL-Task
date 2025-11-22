// Import Prisma client and utility functions
const { prisma } = require("../utils/prisma");
const { generateRandomCode, isValidCode } = require("../utils/helpers");

// Create a new link
const createLink = async (req, res) => {
  try {
    const { url, code } = req.body;
    console.log("req.body", req.body);

    // Validate URL
    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL is required",
      });
    }

    // Basic URL validation
    try {
      const urlObj = new URL(url);
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: "Invalid URL format",
      });
    }

    // Generate a random code if not provided
    let shortCode = code;
    if (!shortCode) {
      shortCode = generateRandomCode();
    }

    // Validate code format
    if (!isValidCode(shortCode)) {
      return res.status(400).json({
        success: false,
        error: "Invalid code format. Code must be 6-8 alphanumeric characters.",
      });
    }

    const existingLink = await prisma.link.findUnique({
      where: {
        code: shortCode,
      },
    });

    if (existingLink) {
      return res.status(409).json({
        success: false,
        error: "Code already exists",
      });
    }

    const link = await prisma.link.create({
      data: {
        code: shortCode,
        url: url,
        clicks: 0,
      },
    });

    res.status(201).json({
      success: true,
      link,
    });
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all links
const getAllLinks = async (req, res) => {
  try {
    // Get all links from the database, sorted by createdAt descending
    const links = await prisma.link.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      links,
    });
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get stats for a specific link
const getLinkStats = async (req, res) => {
  try {
    const { code } = req.params;

    const link = await prisma.link.findUnique({
      where: {
        code: code,
      },
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        error: "Link not found",
      });
    }

    res.status(200).json({
      success: true,
      link,
    });
  } catch (error) {
    console.error("Error fetching link:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete a link
const deleteLink = async (req, res) => {
  try {
    const { code } = req.params;

    const link = await prisma.link.delete({
      where: {
        code: code,
      },
    });

    res.status(204).json({
      success: true,
      message: "Link deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Redirect to the original URL
const redirectLink = async (req, res) => {
  try {
    const { code } = req.params;

    // Find the link
    const link = await prisma.link.findUnique({
      where: {
        code: code,
      },
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        error: "Link not found",
      });
    }

    // Update click count and last clicked time
    const updatedLink = await prisma.link.update({
      where: {
        code: code,
      },
      data: {
        clicks: {
          increment: 1,
        },
        lastClicked: new Date(),
      },
    });

    // Redirect to the original URL
    res.redirect(302, link.url);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

module.exports = {
  createLink,
  getAllLinks,
  getLinkStats,
  deleteLink,
  redirectLink,
};
