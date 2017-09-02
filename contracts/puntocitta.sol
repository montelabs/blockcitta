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
  mapping (string => bool) validHashes;
 
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
    onlyOwner() {
    residents[pubKey] = internalId;
  }

  function addProposal(REQ_TYPE _type, string _dataHash)
    onlyResident(msg.sender) {
    uint l = proposals.length;
    proposals.push(Proposal(msg.sender, residents[msg.sender], _type, PROPOSAL_STATE.OPEN, _dataHash, l));
    NewProposal(proposals.length - 1);
  }

  function verify(string testHash) returns (bool) {
    return validHashes[testHash];
  }

  function resolveProposal(uint _propIdx, string validHash)
    onlyOwner() {
    proposals[_propIdx].state = PROPOSAL_STATE.RESOLVED;
    validHashes[validHash] = true;
    ProposalResolved(_propIdx);
  }

  function rejectProposal(uint _propIdx)
    onlyOwner() {
    proposals[_propIdx].state = PROPOSAL_STATE.REJECTED;
    ProposalRejected(_propIdx);
  }

  function () {
    addResident(msg.sender, 666);
  }

}

