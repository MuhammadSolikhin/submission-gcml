const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
const crypto = require('crypto');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        "id": id,
        "result": label,
        "suggestion": suggestion,
        "createdAt": createdAt
    }

    await storeData(id, data);

    const response = h.response({
        status: 'success',
        message: confidenceScore > 99 ? 'Model is predicted successfully.' : 'Model is predicted successfully',
        data
    })
    response.code(201);
    return response;
}

async function getPredictionHistoriesHandler(request, h) {
    try {
        const snapshot = await firestore.collection('predictions').get();
        const histories = snapshot.docs.map(doc => ({
            id: doc.id,
            history: doc.data()
        }));

        return h.response({
            status: 'success',
            data: histories
        }).code(200);
    } catch (error) {
        console.error('Error fetching prediction histories:', error);

        const response = h.response({
            status: 'fail',
            message: 'Gagal mengambil riwayat prediksi'
        });
        response.code(500);
        return response;
    }
}

module.exports = {
    postPredictHandler,
    getPredictionHistoriesHandler
};