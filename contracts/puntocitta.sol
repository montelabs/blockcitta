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

  struct Request {
    address from;
    uint residentId;
    REQ_TYPE reqType;
    PROPOSAL_STATE state;
    string dataHash;
    uint index;
  }

  struct LawProposal {
    address from;
    string title;
    string description;
    uint signatures;
    uint index;
  }

  address public owner;
  mapping (address => uint) residents;
  Request[] public requests;
  mapping (string => bool) validHashes;
  LawProposal[] public lawProposals;
  mapping (uint => mapping (address => bool)) signedLawProposal;
 
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  modifier onlyResident(address _from) {
    require(residents[_from] > 0);
    _;
  }

  event NewRequest(uint propIdx);
  event RequestResolved(uint propIdx, string validHash);
  event RequestRejected(uint propIdx);
  event NewLawProposal(uint lawPropIdx);
  event NewSignature(uint lawPropIdx, address from);

  function PuntoCitta() {
    owner = msg.sender;
  }

  function addResident(address pubKey, uint internalId)
    onlyOwner() {
    residents[pubKey] = internalId;
  }

  function addRequest(REQ_TYPE _type, string _dataHash)
    onlyResident(msg.sender) {
    uint l = requests.length;
    requests.push(Request(msg.sender, residents[msg.sender], _type, PROPOSAL_STATE.OPEN, _dataHash, l));
    NewRequest(l);
  }

  function addLawProposal(string _title, string _desc)
    onlyResident(msg.sender) {
    uint l = lawProposals.length;
    lawProposals.push(LawProposal(msg.sender, _title, _desc, 0, l));
    NewLawProposal(l);
  }

  function signLawProposal(uint index)
    onlyResident(msg.sender) {
    require(signedLawProposal[index][msg.sender] == false);
    signedLawProposal[index][msg.sender] = true;
    lawProposals[index].signatures++;
    NewSignature(index, msg.sender);
  }

  function hasSigned(address from, uint index) constant returns (bool) {
    return signedLawProposal[index][from];
  }
  
  function verify(string testHash) constant returns (bool) {
    return validHashes[testHash];
  }

  function resolveRequest(uint _propIdx, string validHash)
    onlyOwner() {
    requests[_propIdx].state = PROPOSAL_STATE.RESOLVED;
    validHashes[validHash] = true;
    RequestResolved(_propIdx, validHash);
  }

  function rejectRequest(uint _propIdx)
    onlyOwner() {
    requests[_propIdx].state = PROPOSAL_STATE.REJECTED;
    RequestRejected(_propIdx);
  }

  function () {
    addResident(msg.sender, 666);
  }

}

