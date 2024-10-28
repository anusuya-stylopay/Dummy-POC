exports.mountRoutes = (app) => {
    const express = require('express');
    const authRoutes = require('./authRoutes');
    const studentRoutes = require('./studentRoutes');
    
    // Map All Routes And Middleware
    app.use("/auth", authRoutes);
    app.use("/student", studentRoutes);
}