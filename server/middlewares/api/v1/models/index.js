const express = require('express');
const { nanoid } = require('nanoid');
const db = require('../../../../db');
const {
  API_SUCCESS_RESPONSE,
  API_THROW_ERROR,
  API_VALIDATE_ADMIN,
  API_VALIDATE_AUTH_SCOPE,
  API_VALIDATE_QUERY_PARAMETERS,
  API_VALIDATE_REQUEST_BODY_PARAMETERS,
  asyncHandler,
} = require('../../../../utils/api');
const { USER_ROLE_END_USER } = require('../../../../utils/auth');
const { getNextState } = require('../../../../utils/bot');
const router = express.Router();

router.post(
  '/',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(req.authInfo, 'POST /api/v1/models');

    const { botId } = req.body;

    API_VALIDATE_REQUEST_BODY_PARAMETERS({ botId });

    const bot = await db.get('bots', {
      property: 'id',
      value: botId,
    });

    API_THROW_ERROR(!bot, 404, 'Bot not found');

    if (bot.ownerId !== req.user.id) {
      API_VALIDATE_ADMIN(req.user);
    }

    const model = await db.create('models', {
      ownerId: bot.ownerId,
      botId,
      states: [],
      transitions: [],
    });

    res.status(201);
    res.json(API_SUCCESS_RESPONSE({ model }));

    return next();
  }),
);

router.get(
  '/:modelId',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(req.authInfo, 'GET /api/v1/models/:modelId');

    const model = await db.get('models', {
      property: 'id',
      value: req.params.modelId,
    });

    API_THROW_ERROR(!model, 404, 'Model not found');

    if (model.ownerId !== req.user.id) {
      if (
        req.user.role === USER_ROLE_END_USER &&
        req.user.botId === model.botId
      ) {
        // end user is allowed access to this model
      } else {
        API_VALIDATE_ADMIN(req.user);
      }
    }

    res.json(API_SUCCESS_RESPONSE({ model }));

    return next();
  }),
);

router.post(
  '/:modelId/states',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(
      req.authInfo,
      'POST /api/v1/models/:modelId/states',
    );

    const { message, responses } = req.body;

    API_VALIDATE_REQUEST_BODY_PARAMETERS({ message, responses });

    const model = await db.get('models', {
      property: 'id',
      value: req.params.modelId,
    });

    API_THROW_ERROR(!model, 404, 'Model not found');

    if (model.ownerId !== req.user.id) {
      API_VALIDATE_ADMIN(req.user);
    }

    const state = {
      id: nanoid(),
      message,
      responses,
    };

    model.states.push(state);
    await db.update('models', model.id, { states: model.states });

    res.status(201);
    res.json(
      API_SUCCESS_RESPONSE({
        model,
        state,
      }),
    );

    return next();
  }),
);

router.put(
  '/:modelId/states/:stateId',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(
      req.authInfo,
      'PUT /api/v1/models/:modelId/states/:stateId',
    );

    const { message, responses } = req.body;

    API_VALIDATE_REQUEST_BODY_PARAMETERS({ message, responses });

    const model = await db.get('models', {
      property: 'id',
      value: req.params.modelId,
    });
    API_THROW_ERROR(!model, 404, 'Model not found');

    if (model.ownerId !== req.user.id) {
      API_VALIDATE_ADMIN(req.user);
    }

    const state = model.states.find(e => e.id === req.params.stateId);
    API_THROW_ERROR(!state, 404, 'State not found');

    state.message = message;
    state.responses = responses;
    await db.update('models', model.id, { states: model.states });

    res.json(
      API_SUCCESS_RESPONSE({
        model,
        state,
      }),
    );

    return next();
  }),
);

router.delete(
  '/:modelId/states/:stateId',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(
      req.authInfo,
      'DELETE /api/v1/models/:modelId/states/:stateId',
    );

    const model = await db.get('models', {
      property: 'id',
      value: req.params.modelId,
    });
    API_THROW_ERROR(!model, 404, 'Model not found');

    if (model.ownerId !== req.user.id) {
      API_VALIDATE_ADMIN(req.user);
    }

    model.states = model.states.filter(e => e.id !== req.params.stateId);
    await db.update('models', model.id, { states: model.states });

    res.json(
      API_SUCCESS_RESPONSE({
        model,
        stateId: req.params.stateId,
      }),
    );

    return next();
  }),
);

router.post(
  '/:modelId/transitions',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(
      req.authInfo,
      'POST /api/v1/models/:modelId/transitions',
    );

    const { fromStateId, toStateId, event } = req.body;

    API_VALIDATE_REQUEST_BODY_PARAMETERS({ fromStateId, toStateId, event });

    API_THROW_ERROR(!event.type, 400, 'Missing event type');
    API_THROW_ERROR(
      !event.value && event.value !== '',
      400,
      'Missing event value',
    );

    const model = await db.get('models', {
      property: 'id',
      value: req.params.modelId,
    });
    API_THROW_ERROR(!model, 404, 'Model not found');

    if (model.ownerId !== req.user.id) {
      API_VALIDATE_ADMIN(req.user);
    }

    const transition = {
      id: nanoid(),
      fromStateId,
      toStateId,
      event,
    };
    model.transitions.push(transition);
    await db.update('models', model.id, { transitions: model.transitions });

    res.status(201);
    res.json(
      API_SUCCESS_RESPONSE({
        model,
        transition,
      }),
    );

    return next();
  }),
);

router.delete(
  '/:modelId/transitions/:transitionId',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(
      req.authInfo,
      'DELETE /api/v1/models/:modelId/transitions/:transitionId',
    );

    const model = await db.get('models', {
      property: 'id',
      value: req.params.modelId,
    });
    API_THROW_ERROR(!model, 404, 'Model not found');

    if (model.ownerId !== req.user.id) {
      API_VALIDATE_ADMIN(req.user);
    }

    model.transitions = model.transitions.filter(
      e => e.id !== req.params.transitionId,
    );
    await db.update('models', model.id, { transitions: model.transitions });
    res.json(
      API_SUCCESS_RESPONSE({
        model,
        transitionId: req.params.transitionId,
      }),
    );

    return next();
  }),
);

router.get(
  '/:modelId/states',
  asyncHandler(async (req, res, next) => {
    API_VALIDATE_AUTH_SCOPE(req.authInfo, 'GET /api/v1/models/:modelId/states');
    const {
      fromStateId,
      transitionEventType,
      transitionEventValue,
    } = req.query;
    API_VALIDATE_QUERY_PARAMETERS({
      fromStateId,
      transitionEventType,
    });

    API_THROW_ERROR(
      !transitionEventValue && transitionEventValue !== '',
      400,
      `Missing required query parameter 'transitionEventValue'`,
    );

    const model = await db.get('models', {
      property: 'id',
      value: req.params.modelId,
    });
    API_THROW_ERROR(!model, 404, 'Model not found');

    if (model.ownerId !== req.user.id) {
      if (
        req.user.role === USER_ROLE_END_USER &&
        req.user.botId === model.botId
      ) {
        // end user is allowed access to this model
      } else {
        API_VALIDATE_ADMIN(req.user);
      }
    }

    const getNextStateResponse = getNextState(
      model,
      fromStateId,
      transitionEventType,
      transitionEventValue,
    );

    API_THROW_ERROR(
      !getNextStateResponse.transition,
      404,
      'Transition not found',
    );
    API_THROW_ERROR(!getNextStateResponse.state, 404, 'State not found');

    res.json(
      API_SUCCESS_RESPONSE({
        state: getNextStateResponse.state,
        isFallback: getNextStateResponse.isFallback,
      }),
    );

    return next();
  }),
);

module.exports = router;
