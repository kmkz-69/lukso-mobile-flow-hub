
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title MilestoneContract
 * @dev Manages milestone-based payments between clients and freelancers
 */
contract MilestoneContract {
    enum MilestoneStatus { Locked, Active, Completed, Disputed }
    
    struct Milestone {
        string title;
        uint256 amount;
        MilestoneStatus status;
        bool hasDispute;
        address arbiter;
    }
    
    address public client;
    address public freelancer;
    uint256 public milestoneCount;
    mapping(uint256 => Milestone) public milestones;
    
    event MilestoneCreated(uint256 indexed milestoneId, string title, uint256 amount);
    event MilestoneStatusChanged(uint256 indexed milestoneId, MilestoneStatus status);
    event DisputeCreated(uint256 indexed milestoneId, address arbiter);
    event DisputeResolved(uint256 indexed milestoneId, bool releasedToFreelancer);
    
    modifier onlyClient() {
        require(msg.sender == client, "Only client can call this function");
        _;
    }
    
    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only freelancer can call this function");
        _;
    }
    
    modifier onlyArbiter(uint256 _milestoneId) {
        require(msg.sender == milestones[_milestoneId].arbiter, "Only assigned arbiter can call this function");
        _;
    }
    
    constructor(address _freelancer) payable {
        client = msg.sender;
        freelancer = _freelancer;
    }
    
    /**
     * @dev Create a new milestone with funds deposited in escrow
     * @param _title Title of the milestone
     * @return ID of the created milestone
     */
    function createMilestone(string memory _title) external payable onlyClient returns (uint256) {
        require(msg.value > 0, "Must deposit funds for milestone");
        
        uint256 milestoneId = milestoneCount;
        milestones[milestoneId] = Milestone({
            title: _title,
            amount: msg.value,
            status: MilestoneStatus.Active,
            hasDispute: false,
            arbiter: address(0)
        });
        
        milestoneCount++;
        
        emit MilestoneCreated(milestoneId, _title, msg.value);
        return milestoneId;
    }
    
    /**
     * @dev Mark a milestone as completed by the freelancer
     * @param _milestoneId ID of the milestone to complete
     */
    function completeMilestone(uint256 _milestoneId) external onlyFreelancer {
        require(_milestoneId < milestoneCount, "Milestone does not exist");
        require(milestones[_milestoneId].status == MilestoneStatus.Active, "Milestone is not active");
        require(!milestones[_milestoneId].hasDispute, "Milestone has an ongoing dispute");
        
        milestones[_milestoneId].status = MilestoneStatus.Completed;
        
        emit MilestoneStatusChanged(_milestoneId, MilestoneStatus.Completed);
    }
    
    /**
     * @dev Release funds to the freelancer upon milestone completion
     * @param _milestoneId ID of the completed milestone
     */
    function releaseFunds(uint256 _milestoneId) external onlyClient {
        require(_milestoneId < milestoneCount, "Milestone does not exist");
        require(milestones[_milestoneId].status == MilestoneStatus.Completed, "Milestone is not completed");
        require(!milestones[_milestoneId].hasDispute, "Milestone has an ongoing dispute");
        
        uint256 amount = milestones[_milestoneId].amount;
        
        (bool sent, ) = freelancer.call{value: amount}("");
        require(sent, "Failed to send funds to freelancer");
        
        emit MilestoneStatusChanged(_milestoneId, MilestoneStatus.Completed);
    }
    
    /**
     * @dev Create a dispute for a milestone
     * @param _milestoneId ID of the milestone
     * @param _arbiter Address of the third-party arbiter
     */
    function createDispute(uint256 _milestoneId, address _arbiter) external {
        require(msg.sender == client || msg.sender == freelancer, "Only client or freelancer can create dispute");
        require(_milestoneId < milestoneCount, "Milestone does not exist");
        require(!milestones[_milestoneId].hasDispute, "Dispute already exists");
        require(_arbiter != client && _arbiter != freelancer, "Arbiter must be a third party");
        
        milestones[_milestoneId].hasDispute = true;
        milestones[_milestoneId].status = MilestoneStatus.Disputed;
        milestones[_milestoneId].arbiter = _arbiter;
        
        emit DisputeCreated(_milestoneId, _arbiter);
        emit MilestoneStatusChanged(_milestoneId, MilestoneStatus.Disputed);
    }
    
    /**
     * @dev Resolve a dispute by the assigned arbiter
     * @param _milestoneId ID of the disputed milestone
     * @param _releaseToFreelancer Whether to release funds to freelancer or return to client
     */
    function resolveDispute(uint256 _milestoneId, bool _releaseToFreelancer) external onlyArbiter(_milestoneId) {
        require(_milestoneId < milestoneCount, "Milestone does not exist");
        require(milestones[_milestoneId].hasDispute, "No dispute exists for this milestone");
        
        uint256 amount = milestones[_milestoneId].amount;
        address recipient = _releaseToFreelancer ? freelancer : client;
        
        milestones[_milestoneId].hasDispute = false;
        milestones[_milestoneId].status = _releaseToFreelancer ? MilestoneStatus.Completed : MilestoneStatus.Active;
        
        (bool sent, ) = recipient.call{value: amount}("");
        require(sent, "Failed to send funds");
        
        emit DisputeResolved(_milestoneId, _releaseToFreelancer);
        emit MilestoneStatusChanged(_milestoneId, milestones[_milestoneId].status);
    }
    
    /**
     * @dev Get information about a milestone
     * @param _milestoneId ID of the milestone
     * @return Title, amount, status, and dispute status of the milestone
     */
    function getMilestone(uint256 _milestoneId) external view returns (
        string memory, 
        uint256, 
        MilestoneStatus, 
        bool
    ) {
        require(_milestoneId < milestoneCount, "Milestone does not exist");
        
        Milestone memory milestone = milestones[_milestoneId];
        return (
            milestone.title,
            milestone.amount,
            milestone.status,
            milestone.hasDispute
        );
    }
}
