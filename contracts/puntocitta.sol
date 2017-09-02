pragma solidity ^0.4.11;

contract PuntoCitta {
  enum REQ_TYPE {
    CERT_DOM
  }

  enum PROPOSAL_STATE {
    OPEN,
    RESOLVED,
    REJECTED
  }

  struct Proposal {
    address from;
    uint residentId;
    REQ_TYPE reqType;
    PROPOSAL_STATE state;
    string dataHash;
    uint index;
  }

  address public owner;
  mapping (address => uint) residents;
  Proposal[] public proposals;
 
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  modifier onlyResident(address _from) {
    require(residents[_from] > 0);
    _;
  }

  event NewProposal(uint propIdx);
  event ProposalResolved(uint propIdx);
  event ProposalRejected(uint propIdx);

  function PuntoCitta() {
    owner = msg.sender;
  }

  function addResident(address pubKey, uint internalId)
    {//onlyOwner() {
    residents[pubKey] = internalId;
  }

  function addProposal(address _from, REQ_TYPE _type, string _dataHash)
    onlyResident(_from) {
    require(msg.sender == _from);
    proposals.push(Proposal(_from, residents[_from], _type, PROPOSAL_STATE.OPEN, _dataHash, proposals.length));
    NewProposal(proposals.length - 1);
  }

  function getProposal(uint propIdx) returns (address, uint, REQ_TYPE, PROPOSAL_STATE, string) {
    require(msg.sender == owner || msg.sender == proposals[propIdx].from);
    return (proposals[propIdx].from, proposals[propIdx].residentId, proposals[propIdx].reqType, proposals[propIdx].state, proposals[propIdx].dataHash);
  }

  function resolveProposal(uint _propIdx)
    onlyOwner() {
    proposals[_propIdx].state = PROPOSAL_STATE.RESOLVED;
    ProposalResolved(_propIdx);
  }

  function rejectProposal(uint _propIdx)
    onlyOwner() {
    proposals[_propIdx].state = PROPOSAL_STATE.REJECTED;
    ProposalRejected(_propIdx);
  }

  function () {
    addResident(msg.sender, 666);
    addProposal(msg.sender, REQ_TYPE.CERT_DOM, 'hashhashhashhash');
  }

}

