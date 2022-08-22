import retrieveWalletsRefId from '~/utils/retrieveWalletsRefId';

export default ({ refId, myself }) => {
  const { addr1, addr2 } = retrieveWalletsRefId(refId);
  let proceed = false;
  let recipient = '';
  let myselfOrder = '';
  let recipientOrder = '';

  if (myself === addr1 || myself === addr2) proceed = true;

  if (proceed) {
    if (myself !== addr1) {
      recipient = addr1;
      recipientOrder = 'addr1';
      myselfOrder = 'addr2';
    } else if (myself !== addr2) {
      recipient = addr2;
      recipientOrder = 'addr2';
      myselfOrder = 'addr1';
    }

    return {
      myself,
      recipient,
      myselfOrder,
      recipientOrder,
    };
  } else {
    return false;
  }
};
