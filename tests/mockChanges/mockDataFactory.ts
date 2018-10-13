
export default function getMockDataToPost(workingData, mock){
  const commonChangeProps = {
    user_id: workingData.users[mock.user]._id,
    commit_id: workingData[mock.commit]._id,
    node_id: workingData[mock.node]._id,
    subFormat: "ASS"
  }

  let toSend = [];

  for(const change of mock.changes){
    toSend.push(Object.assign(change, commonChangeProps))
  }

  return toSend;
}
