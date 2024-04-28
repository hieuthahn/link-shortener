import { linkController } from '@/controllers';
import auth from '@/middlewares/auth';
import validate from '@/middlewares/validate';
import { linkValidation } from '@/validations';
import express from 'express';

const router = express.Router();

router.post('/', validate(linkValidation.createShortenLink), linkController.createShortenLink);
router.get('/', auth(), validate(linkValidation.getShortenLinks), linkController.getShortenLinks);
router.get('/:shortCode', validate(linkValidation.getShortenLinkByShortCode), linkController.getShortenLinkByShortCode);
router.put('/:linkId', validate(linkValidation.updateShortenLinkById), linkController.updateShortenLinkById);
router.delete('/:linkId', validate(linkValidation.deleteShortenLinkById), linkController.deleteShortenLinkById);

export default router;
