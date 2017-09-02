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
    REQ_TYPE reqType;
    PROPOSAL_STATE state;
    string dataHash;
    uint index;
  }

  address owner;
  mapping (address => uint) residents;
  Proposal[] proposals;
 
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  modifier onlyResident(address _from) {
    require(residents[_from] > 0);
    _;
  }

  event ProposalResolved(uint propIdx);
  event ProposalRejected(uint propIdx);

  function PuntoCitta() {
    owner = msg.sender;
  }

  function addResident(address pubKey, uint internalId)
    onlyOwner() {
    residents[pubKey] = internalId;
  }

  function addProposal(address _from, REQ_TYPE _type, string _dataHash)
    onlyResident(_from) {
    require(msg.sender == _from);
    proposals.push(Proposal(_from, _type, PROPOSAL_STATE.OPEN, _dataHash, proposals.length));
  }

  /*
  function getProposal(uint propIdx) returns (address, REQ_TYPE, PROPOSAL_STATE, string) {
    require(msg.sender == owner || msg.sender == proposals[propIdx].from);
    return (proposals[propIdx].from, proposals[propIdx].reqType, proposals[propIdx].state, proposals[propIdx].dataHash);
  }
  */

  /*
  function getProposals() returns (Proposal[]) {
    if (msg.sender == owner)
      return proposals;
    Proposal[] residentProposals;
    for (uint i = 0; i < proposals.length; ++i) {
      if (proposals[i].from == msg.sender)
        residentProposals.push(proposals[i]);
    }
    return residentProposals;
  }
  */

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

}

